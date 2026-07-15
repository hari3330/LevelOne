import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  icon: SvgIconComponent;
  label: string;
  value: string;
  sublabel?: string;
  accentColor?: string;
}

/** A compact card used throughout the dashboard/progress screens to show one metric. */
export default function StatCard({ icon: Icon, label, value, sublabel, accentColor }: StatCardProps) {
  const color = accentColor ?? '#4F46E5';
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2.5,
          bgcolor: `${color}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1.25,
        }}
      >
        <Icon sx={{ fontSize: 20, color }} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, mt: 0.25 }}>
        {value}
      </Typography>
      {sublabel && (
        <Typography variant="caption" color="text.secondary">
          {sublabel}
        </Typography>
      )}
    </Card>
  );
}
