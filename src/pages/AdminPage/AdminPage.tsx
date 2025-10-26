import { SyntheticEvent, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
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
      <Stack
        spacing={{ xs: 4, md: 6 }}
        sx={{
          px: { xs: 3, sm: 5, lg: 8 },
          py: { xs: 6, md: 8 },
        }}
      >
        <PageHero
          title="Administration"
          description="Monitor payouts and maintain user accounts from a single dashboard."
        />
        <Stack spacing={3}>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Administration sections"
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              '& .MuiTabs-flexContainer': {
                gap: 0.5,
              },
              '& .MuiTab-root': {
                minHeight: 48,
              },
            }}
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
          <Typography variant="body2" color="text.secondary">
            {activeDescription}
          </Typography>
        </Stack>
        <TabPanel value="payoutTasks" current={tab}>
          <PayoutTasksTab />
        </TabPanel>
        <TabPanel value="users" current={tab}>
          <UserManagementTab />
        </TabPanel>
      </Stack>
    </>
  );
}

export default AdminPage;
