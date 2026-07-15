import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { AnimatePresence, motion } from 'framer-motion';

import { useAppData } from './context/AppDataContext';
import SetupScreen from './components/SetupScreen';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import Discipline from './pages/Discipline';
import Settings from './pages/Settings';

type Tab = 'dashboard' | 'workout' | 'progress' | 'discipline' | 'settings';

export default function App() {
  const { data } = useAppData();
  const [tab, setTab] = useState<Tab>('dashboard');

  // First launch: no profile saved yet. Show the setup flow and nothing else.
  if (!data.profile) {
    return <SetupScreen />;
  }

  const pages: Record<Tab, React.ReactNode> = {
    dashboard: <Dashboard onStartToday={() => setTab('workout')} />,
    workout: <Workout />,
    progress: <Progress />,
    discipline: <Discipline />,
    settings: <Settings />,
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 560,
          width: '100%',
          mx: 'auto',
          px: 2,
          pt: 2,
          pb: 12,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {pages[tab]}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Paper
        elevation={0}
        className="safe-bottom"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 10,
        }}
      >
        <Box sx={{ maxWidth: 560, mx: 'auto' }}>
          <BottomNavigation
            value={tab}
            onChange={(_, value: Tab) => setTab(value)}
            showLabels
          >
            <BottomNavigationAction
              label="Dashboard"
              value="dashboard"
              icon={<SpaceDashboardRoundedIcon />}
            />
            <BottomNavigationAction
              label="Workout"
              value="workout"
              icon={<FitnessCenterRoundedIcon />}
            />
            <BottomNavigationAction
              label="Progress"
              value="progress"
              icon={<TimelineRoundedIcon />}
            />
            <BottomNavigationAction
              label="Discipline"
              value="discipline"
              icon={<SelfImprovementRoundedIcon />}
            />
            <BottomNavigationAction
              label="Settings"
              value="settings"
              icon={<SettingsRoundedIcon />}
            />
          </BottomNavigation>
        </Box>
      </Paper>
    </Box>
  );
}
