import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { motion } from 'framer-motion';

import { FoodEntry } from '../../types';

interface FoodEntryCardProps {
  entry: FoodEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FoodEntryCard({ entry, onEdit, onDelete }: FoodEntryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          py: 1.25,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {entry.foodName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {entry.quantity}
            {entry.unit === 'serving' ? ' serving' + (entry.quantity !== 1 ? 's' : '') : entry.unit}
            {'  ·  '}
            {Math.round(entry.calories)} kcal
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.25 }}>
            <Typography variant="caption" color="text.secondary">
              P {entry.protein.toFixed(1)}g
            </Typography>
            <Typography variant="caption" color="text.secondary">
              C {entry.carbs.toFixed(1)}g
            </Typography>
            <Typography variant="caption" color="text.secondary">
              F {entry.fat.toFixed(1)}g
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={onEdit} aria-label="Edit food entry">
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} aria-label="Delete food entry">
            <DeleteRoundedIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      </Box>
    </motion.div>
  );
}
