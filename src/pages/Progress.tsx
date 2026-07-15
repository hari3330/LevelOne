import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/StatCard';
import CalendarGrid from '../components/CalendarGrid';
import {
  buildChallengeGrid,
  buildChartData,
  calcChallengeProgress,
  calcWeightStats,
  currentChallengeDay,
} from '../utils/calculations';
import { formatDisplayDate, formatLongDate, todayISO } from '../utils/dateUtils';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';

export default function Progress() {
  const { data, logWeight } = useAppData();
  const profile = data.profile!;
  const today = todayISO();

  const alreadyLoggedToday = data.weightLogs.some((w) => w.date === today);
  const [weightInput, setWeightInput] = useState('');

  const stats = calcWeightStats(profile, data.weightLogs);
  const chartData = buildChartData(profile, data.weightLogs);
  const grid = buildChallengeGrid(profile, data.checklists);
  const { percentage } = calcChallengeProgress(profile, data.checklists);
  const challengeDay = currentChallengeDay(profile);

  function handleLogWeight() {
    const value = Number(weightInput);
    if (!value || value <= 0) return;
    logWeight(value, today);
    setWeightInput('');
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatLongDate(today)}
        </Typography>
      </Box>

      {/* Weight entry */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {alreadyLoggedToday ? "Update Today's Weight" : "Log Today's Weight"}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <TextField
            fullWidth
            type="number"
            placeholder={stats.currentWeight.toFixed(1)}
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
          />
          <Button variant="contained" onClick={handleLogWeight} sx={{ px: 3 }}>
            Save
          </Button>
        </Stack>
        {alreadyLoggedToday && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            You've already logged weight today — saving again will update it.
          </Typography>
        )}
      </Card>

      {/* Weight stats */}
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <StatCard
            icon={ScaleRoundedIcon}
            label="Weight Lost"
            value={`${stats.weightLost >= 0 ? '' : '+'}${Math.abs(stats.weightLost).toFixed(1)} kg`}
            accentColor="#22C55E"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={TrendingDownRoundedIcon}
            label="Remaining"
            value={`${stats.remaining.toFixed(1)} kg`}
            accentColor="#4F46E5"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={SpeedRoundedIcon}
            label="Avg Weekly Loss"
            value={`${stats.avgWeeklyLoss.toFixed(2)} kg`}
            accentColor="#0EA5E9"
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard
            icon={EventRoundedIcon}
            label="Expected Finish"
            value={stats.expectedFinishDate ? formatDisplayDate(stats.expectedFinishDate) : 'Not enough data'}
            accentColor="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Weight Over Time
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <LegendDot color="#4F46E5" label="Actual" />
          <LegendDot color="#94A3B8" label="Target" />
        </Box>
        <Box sx={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => formatDisplayDate(d)}
                tick={{ fontSize: 11, fill: '#64748B' }}
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <ChartTooltip
                labelFormatter={(d: string) => formatDisplayDate(d)}
                formatter={(value: number) => [`${value.toFixed(1)} kg`]}
              />
              <Line type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} dot={{ r: 3 }} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* 90-day challenge */}
      <Card sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Day {challengeDay} / {profile.challengeLength}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={700}>
            {percentage}%
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={percentage} sx={{ mb: 2 }} />
        <CalendarGrid days={grid} />
      </Card>
    </Stack>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
