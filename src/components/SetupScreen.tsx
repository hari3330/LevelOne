import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { motion } from 'framer-motion';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

import { useAppData } from '../context/AppDataContext';
import { todayISO } from '../utils/dateUtils';
import { Profile } from '../types';

// Fields are kept as strings while editing so the inputs can be empty/partial,
// and only validated + coerced to numbers on submit.
interface FormState {
  name: string;
  heightCm: string;
  currentWeight: string;
  targetWeight: string;
  challengeLength: string;
  calorieGoal: string;
  proteinGoal: string;
}

const initialForm: FormState = {
  name: '',
  heightCm: '',
  currentWeight: '',
  targetWeight: '',
  challengeLength: '90',
  calorieGoal: '2000',
  proteinGoal: '150',
};

export default function SetupScreen() {
  const { createProfile } = useAppData();
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState(false);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const heightNum = Number(form.heightCm);
  const currentWeightNum = Number(form.currentWeight);
  const targetWeightNum = Number(form.targetWeight);
  const challengeLengthNum = Number(form.challengeLength);
  const calorieGoalNum = Number(form.calorieGoal);
  const proteinGoalNum = Number(form.proteinGoal);

  const isValid =
    form.name.trim().length > 0 &&
    heightNum > 0 &&
    currentWeightNum > 0 &&
    targetWeightNum > 0 &&
    challengeLengthNum > 0 &&
    calorieGoalNum > 0 &&
    proteinGoalNum > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const profile: Profile = {
      name: form.name.trim(),
      heightCm: heightNum,
      startWeight: currentWeightNum,
      targetWeight: targetWeightNum,
      challengeLength: challengeLengthNum,
      calorieGoal: calorieGoalNum,
      proteinGoal: proteinGoalNum,
      startDate: todayISO(),
    };
    createProfile(profile);
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 5,
            p: 3.5,
            boxShadow: '0 4px 24px rgba(30,27,46,0.08)',
          }}
        >
          <Stack spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <BoltRoundedIcon sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h4" fontWeight={800}>
              ARISE
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Set up your challenge to get started. You'll only do this once.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={touched && form.name.trim().length === 0}
              helperText={touched && form.name.trim().length === 0 ? 'Enter your name' : ' '}
              autoFocus
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Height"
                type="number"
                fullWidth
                value={form.heightCm}
                onChange={(e) => set('heightCm', e.target.value)}
                error={touched && heightNum <= 0}
                helperText={touched && heightNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
              />
              <TextField
                label="Current Weight"
                type="number"
                fullWidth
                value={form.currentWeight}
                onChange={(e) => set('currentWeight', e.target.value)}
                error={touched && currentWeightNum <= 0}
                helperText={touched && currentWeightNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Target Weight"
                type="number"
                fullWidth
                value={form.targetWeight}
                onChange={(e) => set('targetWeight', e.target.value)}
                error={touched && targetWeightNum <= 0}
                helperText={touched && targetWeightNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              />
              <TextField
                label="Challenge Length"
                type="number"
                fullWidth
                value={form.challengeLength}
                onChange={(e) => set('challengeLength', e.target.value)}
                error={touched && challengeLengthNum <= 0}
                helperText={touched && challengeLengthNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Daily Calorie Goal"
                type="number"
                fullWidth
                value={form.calorieGoal}
                onChange={(e) => set('calorieGoal', e.target.value)}
                error={touched && calorieGoalNum <= 0}
                helperText={touched && calorieGoalNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
              />
              <TextField
                label="Protein Goal"
                type="number"
                fullWidth
                value={form.proteinGoal}
                onChange={(e) => set('proteinGoal', e.target.value)}
                error={touched && proteinGoalNum <= 0}
                helperText={touched && proteinGoalNum <= 0 ? 'Required' : ' '}
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
              />
            </Stack>

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
              START CHALLENGE
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
}
