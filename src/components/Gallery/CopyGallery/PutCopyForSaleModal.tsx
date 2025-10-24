import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PriceInputSelect from '@/components/Forms/Fields/Select/PriceInputSelect/PriceInputSelect'

type PutCopyForSaleModalProps = {
    open: boolean
    copy?: CreatedCopy
    loading?: boolean
    onClose: () => void
    onSubmit: (price: Price) => void
}

const emptyPrice: Price = { amount: '', currency: 'euro' }

const PutCopyForSaleModal = (props: PutCopyForSaleModalProps) => {
    const { open, copy, loading = false, onClose, onSubmit } = props
    const [price, setPrice] = useState<Price>(emptyPrice)
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (copy) {
            setPrice({
                amount: copy.price ?? '',
                currency: (copy.currency as AcceptedCurrency) ?? 'euro'
            })
        } else {
            setPrice({ ...emptyPrice })
        }
        setError(undefined)
    }, [copy, open])

    const handleClose = () => {
        if (!loading) {
            onClose()
        }
    }

    const handleConfirm = () => {
        if (!price.amount) {
            setError('Please enter a price before putting the copy up for sale.')
            return
        }
        setError(undefined)
        onSubmit(price)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Set a sale price</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {copy
                            ? `Choose the price for "${copy.title?.name ?? 'this copy'}".`
                            : 'Choose the price for this copy.'}
                    </Typography>
                    <PriceInputSelect
                        key={copy?.id ?? 'new-sale'}
                        price={price}
                        onChange={(newPrice) => {
                            setPrice(newPrice)
                            if (error) {
                                setError(undefined)
                            }
                        }}
                    />
                    {error && <FormHelperText error>{error}</FormHelperText>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={loading} variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PutCopyForSaleModal
