import AddScanImageButton from '@/components/Forms/Buttons/AddScanImageButton';
import FormSubmitAndResetButtons from '@/components/Forms/Buttons/FormSubmitAndResetButtons';
import PageHero from '@/components/PageHero';
import objectToFormData from '@/utils/formData';
import { Box, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { scanPicture } from '@/backend/api/scan';
import indexStorage from '@/store/indexedDbStorage';
import type { ScanResultHandlerProps } from './ScanResultHandler';
import ScanResultHandler from './ScanResultHandler';

export type ScanPageState = {
  BACK_COVER?: File;
  FRONT_COVER?: File;
  SPINE?: File;
  hasScanResult: boolean;
  scanResult?: ScanResultHandlerProps['data'];
};

const ScanPage = () => {
  const [state, setState] = useState<ScanPageState>({ hasScanResult: false });
  const [hydrated, setHydrated] = useState(false);
  const [get, set, remove] = indexStorage;

  useEffect(() => {
    console.log('loading files from index');
    get('scanPageState', { hasScanResult: false }).then((storedState) => {
      setState(storedState);
      setHydrated(true);
    });
  }, [get]);

  useEffect(() => {
    if (hydrated) {
      console.log('storing file in index');
      set('scanPageState', state);
    }
  }, [hydrated, set, state]);

  const hasFile = Object.keys(state).filter((key) => state[key as keyof typeof state] instanceof File).length > 0;
  console.log('has file : %s', hasFile);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
        <PageHero
          title="Scan"
          description="Upload cover photos to let BD Market automatically recognize and prepare title information."
          align="center"
        />
        {!state.hasScanResult && (
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const payload = objectToFormData(state);
              scanPicture(payload, (data) => {
                console.log('Scan Picture response', data);
                setState((prevState) => ({ ...prevState, hasScanResult: true, scanResult: data }));
              });
            }}
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" sx={{ width: '100%', maxWidth: 1040 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 3, md: 4 }}
                justifyContent="center"
                alignItems="stretch"
                flexWrap="wrap"
                sx={{ width: '100%' }}
              >
                <AddScanImageButton
                  label="Front Cover"
                  onSelectedImage={(imageFile) => setState((prevState) => ({ ...prevState, FRONT_COVER: imageFile }))}
                  selectedImage={state.FRONT_COVER}
                />
                <AddScanImageButton
                  label="Back Cover"
                  onSelectedImage={(imageFile) => setState((prevState) => ({ ...prevState, BACK_COVER: imageFile }))}
                  selectedImage={state.BACK_COVER}
                />
                <AddScanImageButton
                  label="Spine"
                  onSelectedImage={(imageFile) => setState((prevState) => ({ ...prevState, SPINE: imageFile }))}
                  selectedImage={state.SPINE}
                />
              </Stack>
              {hasFile && (
                <FormSubmitAndResetButtons
                  state={state}
                  alignment="center"
                  submitLabel="Analyze"
                  handleReset={() => {
                    remove('scanPageState');
                    setState({ hasScanResult: false });
                  }}
                />
              )}
            </Stack>
          </Box>
        )}
        {state.hasScanResult && (
          <ScanResultHandler
            resetHandler={() => setState((prevState) => ({ ...prevState, hasScanResult: false }))}
            data={state.scanResult}
          />
        )}
      </Stack>
    </Container>
  );
};

export default ScanPage;
