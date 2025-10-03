import { Box, Button, Stack } from "@mui/material"
import { useEffect, useMemo, useRef, useState, useLayoutEffect, useId } from "react"

type Point = { x: number, y: number }
type BoundingBox = [Point, Point, Point, Point]

type ImageCropProps = {
  imgUrl: string
  initialMaskBox?: BoundingBox
  onChange?: (points: BoundingBox) => void
  height?: number
  handleSize?: number
  clampInside?: boolean
  onCrop?: (croppedImage: Awaited<ReturnType< typeof cropVisibleImage>>) => any 
}

const ImageCrop = (props: ImageCropProps) => {
  const height = props.height ?? 420
  const handleSize = props.handleSize ?? 14
  const clampInside = props.clampInside ?? true

  const defaultMask = useMemo<BoundingBox>(() => {
    const box: BoundingBox = props.initialMaskBox ?? [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.28 },
      { x: 0.75, y: 0.72 },
      { x: 0.28, y: 0.7 },
    ]
    return box.map(p => clampInside ? clampPoint(p) : p) as BoundingBox
  }, [props.initialMaskBox, clampInside])

  const [maskBox, setMaskBox] = useState<BoundingBox>(defaultMask)
  const [handleIndex, setHandleIndex] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [imageDimensions, setImageDimensions] = useState<{ w: number, h: number } | undefined>(undefined)
  const [containerSize, setContainerSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 })

  // measure container with ResizeObserver so rect updates on layout changes
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setContainerSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onImgLoad = () => {
    const img = imageRef.current
    if (!img) throw new Error('Missing Image Element')
    setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight })
  }

  // displayed image rect in container pixels
  const imageDisplayRect = useMemo(() => {
    if (!imageDimensions) return { left: 0, top: 0, width: 0, height: 0 }
    return getContainedRectangle(containerSize.w, containerSize.h, imageDimensions.w, imageDimensions.h)
  }, [imageDimensions, containerSize])

  useEffect(() => { props.onChange?.(maskBox) }, [maskBox, props.onChange])

  // pointer move in container px → map to normalized inside imageDisplayRect
  useEffect(() => {
    const el = containerRef.current
    if (!el || handleIndex === null) return

    const handleMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = event.clientX - r.left
      const cy = event.clientY - r.top

      // clamp to the visible image rect
      const ix = Math.max(imageDisplayRect.left, Math.min(imageDisplayRect.left + imageDisplayRect.width, cx))
      const iy = Math.max(imageDisplayRect.top, Math.min(imageDisplayRect.top + imageDisplayRect.height, cy))

      // convert to normalized (0..1) inside imageDisplayRect
      const nx = (ix - imageDisplayRect.left) / (imageDisplayRect.width || 1)
      const ny = (iy - imageDisplayRect.top) / (imageDisplayRect.height || 1)

      const outX = clampInside ? clampValue(nx) : nx
      const outY = clampInside ? clampValue(ny) : ny

      setMaskBox(prev => {
        const next = prev.slice() as BoundingBox
        next[handleIndex] = { x: outX, y: outY }
        return next
      })
    }

    const handleUp = () => setHandleIndex(null)

    window.addEventListener("pointermove", handleMove, { passive: true })
    window.addEventListener("pointerup", handleUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }
  }, [handleIndex, clampInside, imageDisplayRect])

  // Build polygon points in **container pixels** so overlay lines up perfectly
  const polygonPointsPx = useMemo(() => {
    const toPx = (p: Point) => ({
      x: imageDisplayRect.left + p.x * imageDisplayRect.width,
      y: imageDisplayRect.top + p.y * imageDisplayRect.height,
    })
    return maskBox.map(p => {
      const q = toPx(p)
      return `${q.x},${q.y}`
    }).join(" ")
  }, [maskBox, imageDisplayRect])

  const maskId = useId() // unique, future-proof if you render multiple

  return (
    <Stack direction={'column'}>
        <Box
        ref={containerRef}
        sx={{
            position: 'relative',
            width: '100%',
            height,
            borderRadius: 1,
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            backgroundColor: 'background.default',
            touchAction: 'none'
        }}
        >
        <img
            ref={imageRef}
            src={props.imgUrl}
            alt=""
            draggable={false}
            onLoad={onImgLoad}
            style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none'
            }}
        />

        {/* SVG overlay drawn in container px coordinates */}
        <svg
            viewBox={`0 0 ${Math.max(containerSize.w, 1)} ${Math.max(containerSize.h, 1)}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
                <rect x="0" y="0" width={containerSize.w} height={containerSize.h} fill="white" />
                <polygon points={polygonPointsPx} fill="black" />
            </mask>
            </defs>
            <rect
            x="0"
            y="0"
            width={containerSize.w}
            height={containerSize.h}
            fill="black"
            opacity="0.70"
            mask={`url(#${maskId})`}
            />
            <polygon points={polygonPointsPx} fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Handles positioned in container px */}
        {maskBox.map((point, index) => {
            const { left, top } = handleCssPosition(point, handleSize, imageDisplayRect)
            return (
            <Box
                key={index}
                onPointerDown={() => setHandleIndex(index)}
                sx={{
                position: "absolute",
                left,
                top,
                width: handleSize,
                height: handleSize,
                borderRadius: '50%',
                backgroundColor: 'background.paper',
                border: '2px solid white',
                boxShadow: 1,
                cursor: 'grab',
                "&:active": { cursor: 'grabbing' },
                touchAction: 'none'
                }}
            />
            )
        })}
        </Box>
        <Button
            onClick={async () => {
              console.log(`cropping based on maskBox`, maskBox)
              const croppedImage = await cropVisibleImage(props.imgUrl, maskBox)
              const fullBox : BoundingBox = [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 1},
              ]
              setMaskBox(fullBox)
              props.onCrop && props.onCrop(croppedImage) 
            }}
        >Crop</Button>
    </Stack>
  )
}

const clampValue = (v: number) => v < 0 ? 0 : v > 1 ? 1 : v
const clampPoint = (point: Point): Point => ({ x: clampValue(point.x), y: clampValue(point.y) })

// Position a handle using container px derived from the displayed image rect
const handleCssPosition = (
  point: Point,
  size: number,
  imageDimensions?: { top: number, left: number, width: number, height: number }
): { left: string, top: string } => {
  const offset = size / 2
  const leftPx = (imageDimensions ? imageDimensions.left : 0) + point.x * (imageDimensions ? imageDimensions.width : 0)
  const topPx = (imageDimensions ? imageDimensions.top : 0) + point.y * (imageDimensions ? imageDimensions.height : 0)
  return {
    left: `calc(${leftPx}px - ${offset}px)`,
    top: `calc(${topPx}px - ${offset}px)`
  }
}

const getContainedRectangle = (containerWidth: number, containerHeight: number, imageWidth: number, imageHeight: number) => {
  const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight)
  const outWidth = scale * imageWidth
  const outHeight = scale * imageHeight
  const left = (containerWidth - outWidth) / 2
  const top = (containerHeight - outHeight) / 2
  return { left, top, width: outWidth, height: outHeight }
}

const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        // image.crossOrigin = "anonymous" //Necessary to make cross origin request if the source comes from a different domain (CORS)
        image.src = imageUrl
    })
}

const cropVisibleImage = async (
    imageUrl: string,
    boundingBox: BoundingBox,
    imageName: string = 'croppedImage',  
    mimeType: "image/png" | "image/jpeg" | "image/webp" = "image/webp",
    quality = 0.95
) => {
    const image = await loadImage(imageUrl)
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight

    const pointInPixel = boundingBox.map(point => ({x: point.x * naturalWidth, y: point.y * naturalHeight})) as BoundingBox

    const xs = pointInPixel.map(point => point.x)
    const ys = pointInPixel.map(point => point.y)
    const minX = Math.max(0, Math.min(...xs))
    const minY = Math.max(0, Math.min(...ys))
    const maxX = Math.min(naturalWidth, Math.max(...xs))
    const maxY = Math.min(naturalHeight, Math.max(...ys))
    const outWidth = Math.max(1, Math.round(maxX - minX))
    const outHeight = Math.max(1, Math.round(maxY - minY))

    const canvas = document.createElement("canvas")
    canvas.width = outWidth
    canvas.height = outHeight
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Failed to get canevas context at ImageCrop.tsx line 266")
    
    if(mimeType === 'image/jpeg'){
        context.fillStyle = '#fff'
        context.fillRect(0,0, outWidth, outHeight)
    }

    context.save()
    context.beginPath()
    context.moveTo(pointInPixel[0].x - minX, pointInPixel[0].y - minY)
    for(let index = 1; index < pointInPixel.length; index++){
        context.lineTo(pointInPixel[index].x - minX, pointInPixel[index].y - minY)
    }
    context.closePath()
    context.clip()

    context.drawImage(image, -minX, -minY)
    context.restore()

    const blob = await new Promise<Blob>((resolve, reject) => {
        try{
            canvas.toBlob( blob =>{ 
                if(!blob) throw new Error('Failed to generate blob at ImageCrop.tsx line 288')
                resolve(blob)
            }, mimeType, quality)
        } catch (error){
            reject(error)
        }
    })
    if(!blob) throw new Error('Failed to generate cropped image blob at ImageCrop.tsx line 288')
    const dataUrl = canvas.toDataURL(mimeType, quality)
    const file = new File([blob], `${imageName}-${Date.now()}.png`,{
        type: blob.type,
        lastModified: Date.now() 
    })
    return {canvas, file, dataUrl}
}

export default ImageCrop
