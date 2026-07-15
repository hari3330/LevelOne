import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { AnimatePresence, motion } from 'framer-motion';

import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/StatCard';
import ChecklistItem from '../components/ChecklistItem';
import MissionCompleteBanner from '../components/MissionCompleteBanner';
import { CHECKLIST_META } from '../types';
import {
  calcBMI,
  bmiCategory,
  calcStreak,
  currentChallengeDay,
  getCurrentWeight,
  isChecklistComplete,
} from '../utils/calculations';
import { getGreeting, todayISO } from '../utils/dateUtils';

export default function Dashboard({ onStartToday }: { onStartToday: () => void }) {
  const { data, toggleChecklistItem, getChecklist } = useAppData();
  const profile = data.profile!;

  const today = todayISO();
  const checklist = getChecklist(today);
  const completedCount = CHECKLIST_META.filter((m) => checklist[m.key]).length;
  const allComplete = isChecklistComplete(checklist);

  const currentWeight = getCurrentWeight(profile, data.weightLogs);
  const currentBmi = calcBMI(currentWeight, profile.heightCm);
  const targetBmi = calcBMI(profile.targetWeight, profile.heightCm);
  const streak = calcStreak(data.checklists);
  const challengeDay = currentChallengeDay(profile);

  return (
    <Stack spacing={2.5}>
      {/* Greeting header */}
      <Box>
        <Typography variant="h5" fontWeight={800}>
          {getGreeting()}, {profile.name.split(' ')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Day {challengeDay} of {profile.challengeLength} · Keep the momentum going
        </Typography>
      </Box>

      {/* Primary stat row: current weight / BMI vs target */}
      <Card sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Current Weight
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {currentWeight.toFixed(1)}
              <Typography component="span" variant="body2" color="text.secondary">
                {' '}
                kg
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              BMI {currentBmi.toFixed(1)} · {bmiCategory(currentBmi)}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Target Weight
            </Typography>
            <Typography variant="h4" fontWeight={800} color="primary.main">
              {profile.targetWeight.toFixed(1)}
              <Typography component="span" variant="body2" color="text.secondary">
                {' '}
                kg
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              BMI {targetBmi.toFixed(1)} · {bmiCategory(targetBmi)}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Streak + challenge day quick stats */}
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <StatCard
            icon={LocalFireDepartmentRoundedIcon}
            label="Current Streak"
            value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
            accentColor="#F59E0B"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={FlagRoundedIcon}
            label="Today's Progress"
            value={`${completedCount}/6 missions`}
            accentColor="#0EA5E9"
          />
        </Grid>
      </Grid>

      {/* Start today CTA */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<PlayArrowRoundedIcon />}
        onClick={onStartToday}
      >
        START TODAY
      </Button>

      {/* Today's checklist */}
      <Card sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Today's Checklist
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completedCount}/6
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(completedCount / 6) * 100}
          sx={{ mb: 1.5 }}
        />
        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
          {CHECKLIST_META.map((item) => (
            <ChecklistItem
              key={item.key}
              label={item.label}
              description={item.description}
              checked={checklist[item.key]}
              onToggle={() => toggleChecklistItem(item.key)}
            />
          ))}
        </Stack>

        <AnimatePresence>
          {allComplete && (
            <Box sx={{ mt: 2 }}>
              <MissionCompleteBanner />
            </Box>
          )}
        </AnimatePresence>
      </Card>
    </Stack>
  );
}
