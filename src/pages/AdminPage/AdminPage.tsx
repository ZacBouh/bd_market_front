import { SyntheticEvent, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import PageHero from '@/components/PageHero';

import PayoutTasksTab from './components/PayoutTasksTab';
import UserManagementTab from './components/UserManagementTab';

type AdminTab = 'payoutTasks' | 'users';

type TabConfig = {
  value: AdminTab;
  label: string;
  description: string;
};

const tabConfig: TabConfig[] = [
  {
    value: 'payoutTasks',
    label: 'Payout Tasks',
    description: 'Review vendor payouts and update their processing status.',
  },
  {
    value: 'users',
    label: 'User Management',
    description: 'Manage user accounts, roles and access.',
  },
];

function TabPanel({ children, value, current }: { children: React.ReactNode; value: AdminTab; current: AdminTab }) {
  const isActive = value === current;

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`admin-tabpanel-${value}`}
      aria-labelledby={`admin-tab-${value}`}
      sx={{ pt: 4 }}
    >
      {isActive ? children : null}
    </Box>
  );
}

function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('payoutTasks');

  const activeDescription = useMemo(
    () => tabConfig.find((config) => config.value === tab)?.description ?? '',
    [tab],
  );

  const handleChange = (_event: SyntheticEvent, newValue: AdminTab) => {
    setTab(newValue);
  };

  return (
    <>
      <meta name="title" content="Admin" />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <PageHero
            title="Administration"
            description="Monitor payouts and maintain user accounts from a single dashboard."
          />
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Administration sections"
            >
              {tabConfig.map((config) => (
                <Tab
                  key={config.value}
                  value={config.value}
                  label={config.label}
                  id={`admin-tab-${config.value}`}
                  aria-controls={`admin-tabpanel-${config.value}`}
                />
              ))}
            </Tabs>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {activeDescription}
            </Typography>
            <TabPanel value="payoutTasks" current={tab}>
              <PayoutTasksTab />
            </TabPanel>
            <TabPanel value="users" current={tab}>
              <UserManagementTab />
            </TabPanel>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default AdminPage;
