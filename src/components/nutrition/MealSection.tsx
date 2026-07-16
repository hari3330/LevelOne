import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AnimatePresence } from 'framer-motion';

import { FoodEntry, MealType } from '../../types';
import FoodEntryCard from './FoodEntryCard';

interface MealSectionProps {
  title: string;
  mealType: MealType;
  entries: FoodEntry[];
  onAdd: () => void;
  onEdit: (entry: FoodEntry) => void;
  onDelete: (entry: FoodEntry) => void;
}

export default function MealSection({ title, entries, onAdd, onEdit, onDelete }: MealSectionProps) {
  const mealCalories = entries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {entries.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {Math.round(mealCalories)} kcal
            </Typography>
          )}
        </Box>
        <IconButton size="small" onClick={onAdd} sx={{ bgcolor: '#EEF2FF' }} aria-label={`Add food to ${title}`}>
          <AddRoundedIcon fontSize="small" color="primary" />
        </IconButton>
      </Stack>

      {entries.length === 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Nothing logged yet
        </Typography>
      ) : (
        <Stack divider={<Divider />} sx={{ mt: 0.5 }}>
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <FoodEntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => onEdit(entry)}
                onDelete={() => onDelete(entry)}
              />
            ))}
          </AnimatePresence>
        </Stack>
      )}
    </Card>
  );
}
