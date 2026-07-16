import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { SvgIconComponent } from '@mui/icons-material';

interface NutrientProgressCardProps {
  icon: SvgIconComponent;
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

/** One dashboard metric at the top of Nutrition: a label, "current / goal", and a progress bar. */
export default function NutrientProgressCard({
  icon: Icon,
  label,
  current,
  goal,
  unit,
  color,
}: NutrientProgressCardProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Icon sx={{ fontSize: 16, color }} />
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>
        {Math.round(current)}
        <Typography component="span" variant="caption" color="text.secondary">
          {' '}
          / {Math.round(goal)} {unit}
        </Typography>
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 6,
          '& .MuiLinearProgress-bar': { backgroundColor: color },
        }}
      />
    </Card>
  );
}
