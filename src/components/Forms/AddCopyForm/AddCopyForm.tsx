import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Stack from "@mui/material/Stack"
import { useCallback, useEffect, useMemo, useState } from "react"

import { API_BASE_URL } from "@/backend/api/api"
import { createCopy, updateCopy } from "@/backend/api/copy"
import { useUser } from "@/hooks/useUser"
import objectToFormData from "@/utils/formData"
import { convertPriceToApi } from "@/utils/price"

import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"
import FormLayout, { FormLayoutSurface } from "../FormLayout/FormLayout"
import TitleAutocomplete from "../Fields/Autocomplete/TitleAutocomplete/TitleAutocomplete"
import CopyConditionSelect from "../Fields/Select/CopyConditionSelect/CopyConditionSelect"
import PriceInputSelect from "../Fields/Select/PriceInputSelect/PriceInputSelect"
import FileInput from "../Fields/FileUpload/FileInput"

type AddCopyFormProps = {
    copyToEdit?: CreatedCopy
    title?: CreatedTitle
    onCopyCreated?: (copy: CreatedCopy) => unknown
    surface?: FormLayoutSurface
}

const AddCopyForm = (props: AddCopyFormProps) => {
    const { copyToEdit, title, onCopyCreated, surface = "card" } = props
    const { user } = useUser()
    const isEditing = Boolean(copyToEdit)
    const showSurfaceHeader = surface !== "plain"

    const computeInitialState = useCallback((): NewCopy => ({
        ownerId: copyToEdit?.owner?.id ?? user?.user.id ?? null,
        titleId: copyToEdit?.title?.id ?? title?.id,
        copyCondition: copyToEdit?.copyCondition,
        price: copyToEdit?.price,
        currency: (copyToEdit?.currency as AcceptedCurrency) ?? "euro",
        boughtForPrice: copyToEdit?.boughtForPrice,
        boughtForCurrency: (copyToEdit?.boughtForCurrency as AcceptedCurrency) ?? "euro",
        coverImageFile: undefined,
        forSale: copyToEdit?.forSale,
    }), [copyToEdit, title?.id, user?.user.id])

    const [newCopy, setNewCopy] = useState<NewCopy>(() => computeInitialState())

    useEffect(() => {
        setNewCopy(computeInitialState())
    }, [computeInitialState])

    const baseCoverImageUrl = useMemo(() => {
        if (copyToEdit?.coverImage?.url) {
            return `${API_BASE_URL}${copyToEdit.coverImage.url}`
        }
        if (title?.coverImage?.url) {
            return `${API_BASE_URL}${title.coverImage.url}`
        }
        return undefined
    }, [copyToEdit?.coverImage?.url, title?.coverImage?.url])

    const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | undefined>(baseCoverImageUrl)

    useEffect(() => {
        setCoverImagePreviewUrl(baseCoverImageUrl)
    }, [baseCoverImageUrl])

    return (
        <FormLayout
            surface={surface}
            contentSpacing={2.5}
            title={
                showSurfaceHeader
                    ? isEditing
                        ? "Update copy"
                        : "Add a new copy"
                    : undefined
            }
            description={
                showSurfaceHeader
                    ? "Upload artwork, set sale details, and keep your collection up to date."
                    : undefined
            }
            onSubmit={(event) => {
                event.stopPropagation()
                event.preventDefault()
                console.log("Add Copy Form Submitted", newCopy)
                const payload = {
                    ...newCopy,
                    price: convertPriceToApi(newCopy.price),
                    boughtForPrice: convertPriceToApi(newCopy.boughtForPrice),
                }
                if (copyToEdit) {
                    updateCopy(objectToFormData({ ...payload, id: copyToEdit.id }))
                    return
                }
                createCopy(objectToFormData(payload), onCopyCreated)
            }}
        >
            <TitleAutocomplete
                onChangeCallback={(_, selectedTitle) =>
                    setNewCopy((previousCopy) => ({ ...previousCopy, titleId: selectedTitle?.id }))
                }
                title={copyToEdit?.title ?? title}
                disabled={Boolean(copyToEdit || title)}
            />
            <CopyConditionSelect
                condition={newCopy.copyCondition ?? ""}
                onChange={(condition) =>
                    setNewCopy((previousCopy) => ({ ...previousCopy, copyCondition: condition.value }))
                }
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
                <Box flex={1}>
                    <PriceInputSelect
                        price={
                            newCopy.price
                                ? { amount: newCopy.price, currency: newCopy.currency ?? "euro" }
                                : undefined
                        }
                        label="Sell Price"
                        onChange={(price) => {
                            setNewCopy((previousCopy) => ({
                                ...previousCopy,
                                price: price.amount,
                                currency: price.currency,
                            }))
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <PriceInputSelect
                        price={
                            newCopy.boughtForPrice
                                ? { amount: newCopy.boughtForPrice, currency: newCopy.boughtForCurrency ?? "euro" }
                                : undefined
                        }
                        label="Bought for"
                        onChange={(price) => {
                            setNewCopy((previousCopy) => ({
                                ...previousCopy,
                                boughtForPrice: price.amount,
                                boughtForCurrency: price.currency,
                            }))
                        }}
                    />
                </Box>
            </Stack>
            {coverImagePreviewUrl && (
                <Card
                    sx={{
                        alignSelf: { sm: "flex-start" },
                        maxWidth: { xs: "100%", sm: 260 },
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: (theme) => theme.shadows[8],
                    }}
                >
                    <CardMedia
                        component="img"
                        image={coverImagePreviewUrl}
                        alt={copyToEdit?.coverImage?.imageName ?? title?.name ?? "Preview"}
                        sx={{ height: 320, objectFit: "cover" }}
                    />
                </Card>
            )}
            <FileInput
                label={copyToEdit?.coverImage ? "Change cover image" : "Choose an Image"}
                accept="image/*"
                direction="column"
                spacing={1.5}
                onFileChange={(event) => {
                    const file = event.target.files?.[0]
                    setNewCopy((previousCopy) => ({ ...previousCopy, coverImageFile: file }))
                    if (file) {
                        setCoverImagePreviewUrl(URL.createObjectURL(file))
                    }
                }}
            />
            <FormSubmitAndResetButtons
                state={newCopy}
                submitLabel={isEditing ? "Update copy" : "Add copy"}
                handleReset={() => {
                    setNewCopy(computeInitialState())
                    setCoverImagePreviewUrl(baseCoverImageUrl)
                }}
            />
        </FormLayout>
    )
}

export default AddCopyForm
