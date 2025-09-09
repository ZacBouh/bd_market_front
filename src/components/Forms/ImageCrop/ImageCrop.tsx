import { Box } from "@mui/material"
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

export default ImageCrop
