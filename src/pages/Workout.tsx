import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { useAppData } from '../context/AppDataContext';
import { WORKOUT_TYPES, WorkoutType } from '../types';
import { todayISO, formatLongDate } from '../utils/dateUtils';

export default function Workout() {
  const { getWorkoutLog, saveWorkoutLog } = useAppData();
  const today = todayISO();
  const existing = getWorkoutLog(today);

  const [done, setDone] = useState<boolean | null>(existing?.done ?? null);
  const [type, setType] = useState<WorkoutType | null>(existing?.type ?? null);
  const [duration, setDuration] = useState<string>(existing ? String(existing.duration) : '');
  const [justSaved, setJustSaved] = useState(false);

  // If the log for today changes elsewhere (e.g. after a reset), keep the form in sync.
  useEffect(() => {
    setDone(existing?.done ?? null);
    setType(existing?.type ?? null);
    setDuration(existing ? String(existing.duration) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.done, existing?.type, existing?.duration]);

  const isValid = done !== null && type !== null && (done === false || Number(duration) >= 0);

  function handleSave() {
    if (done === null || type === null) return;
    saveWorkoutLog({ done, type, duration: Number(duration) || 0 }, today);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Workout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatLongDate(today)}
        </Typography>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Workout Done?
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={done}
              onChange={(_, v) => v !== null && setDone(v)}
            >
              <ToggleButton value={true} sx={{ py: 1.5, fontWeight: 700 }}>
                YES
              </ToggleButton>
              <ToggleButton value={false} sx={{ py: 1.5, fontWeight: 700 }}>
                NO
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Workout Type
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WORKOUT_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  clickable
                  onClick={() => setType(t)}
                  color={type === t ? 'primary' : 'default'}
                  variant={type === t ? 'filled' : 'outlined'}
                  sx={{ py: 2.5, px: 0.5, fontSize: '0.85rem' }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }}
            disabled={done === false}
            helperText={done === false ? 'No duration needed for a rest day' : ' '}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!isValid}
            onClick={handleSave}
          >
            SAVE
          </Button>

          <AnimatePresence>
            {justSaved && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'success.main',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleRoundedIcon fontSize="small" />
                  <Typography variant="body2" fontWeight={600}>
                    Workout saved
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Card>
    </Stack>
  );
}
