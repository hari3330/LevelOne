import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { AnimatePresence, motion } from 'framer-motion';

import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/StatCard';
import HabitCard from '../components/HabitCard';
import AddHabitDialog, { HabitFormValues } from '../components/AddHabitDialog';
import { Habit } from '../types';
import { calcDisciplineStats } from '../utils/habitCalculations';
import { getDailyQuote } from '../utils/quotes';

export default function Discipline() {
  const { data, addHabit, updateHabit, deleteHabit, relapseHabit } = useAppData();
  const { habits } = data;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const stats = calcDisciplineStats(habits);
  const quote = useMemo(() => getDailyQuote(), []);

  function handleOpenAdd() {
    setEditingHabit(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(habit: Habit) {
    setEditingHabit(habit);
    setDialogOpen(true);
  }

  function handleSave(values: HabitFormValues) {
    if (editingHabit) {
      updateHabit(editingHabit.id, values);
    } else {
      addHabit(values);
    }
    setDialogOpen(false);
    setEditingHabit(null);
  }

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100dvh - 180px)' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Discipline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Habits you're quitting, tracked one day at a time
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <StatCard
              icon={ShieldRoundedIcon}
              label="Active Habits"
              value={String(stats.activeHabits)}
              accentColor="#22C55E"
            />
          </Grid>
          <Grid item xs={6}>
            <StatCard
              icon={CalendarMonthRoundedIcon}
              label="Total Clean Days"
              value={String(stats.totalCleanDays)}
              accentColor="#4F46E5"
            />
          </Grid>
          <Grid item xs={6}>
            <StatCard
              icon={EmojiEventsRoundedIcon}
              label="Longest Streak"
              value={String(stats.longestStreak)}
              accentColor="#F59E0B"
            />
          </Grid>
          <Grid item xs={6}>
            <StatCard
              icon={ReplayRoundedIcon}
              label="Total Relapses"
              value={String(stats.totalRelapses)}
              accentColor="#EF4444"
            />
          </Grid>
        </Grid>

        {/* Daily motivational quote */}
        <Card
          sx={{
            p: 2.25,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#fff',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <FormatQuoteRoundedIcon sx={{ opacity: 0.85, mt: 0.25 }} />
            <Typography variant="body2" fontWeight={500} sx={{ fontStyle: 'italic' }}>
              {quote}
            </Typography>
          </Stack>
        </Card>

        {/* Habit list */}
        {habits.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              No habits yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tap the + button to add the first habit you're quitting.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2}>
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={() => handleOpenEdit(habit)}
                  onDelete={() => deleteHabit(habit.id)}
                  onRelapse={() => relapseHabit(habit.id)}
                />
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </Stack>

      {/* Add Habit FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        style={{ position: 'fixed', right: 24, bottom: 96, zIndex: 20 }}
      >
        <Fab color="primary" onClick={handleOpenAdd} aria-label="Add Habit">
          <AddRoundedIcon />
        </Fab>
      </motion.div>

      <AddHabitDialog
        open={dialogOpen}
        habit={editingHabit}
        onClose={() => {
          setDialogOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
}
