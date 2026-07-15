import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

import { useAppData } from '../context/AppDataContext';
import { exportDataAsFile, parseImportedData } from '../utils/storage';

export default function Settings() {
  const { data, updateProfile, resetChallenge, replaceAllData } = useAppData();
  const profile = data.profile!;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: profile.name,
    heightCm: String(profile.heightCm),
    targetWeight: String(profile.targetWeight),
    calorieGoal: String(profile.calorieGoal),
    proteinGoal: String(profile.proteinGoal),
  });
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSaveProfile() {
    const heightCm = Number(form.heightCm);
    const targetWeight = Number(form.targetWeight);
    const calorieGoal = Number(form.calorieGoal);
    const proteinGoal = Number(form.proteinGoal);
    if (!form.name.trim() || !heightCm || !targetWeight || !calorieGoal || !proteinGoal) {
      setErrorMsg('Please fill in every field with a valid value.');
      return;
    }
    updateProfile({
      name: form.name.trim(),
      heightCm,
      targetWeight,
      calorieGoal,
      proteinGoal,
    });
    setSavedMsg(true);
  }

  function handleExport() {
    exportDataAsFile(data);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedData(String(reader.result));
        replaceAllData(imported);
        setSavedMsg(true);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Could not import this file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleConfirmReset() {
    setResetOpen(false);
    resetChallenge();
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your profile and data
        </Typography>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Profile
        </Typography>
        <Stack spacing={2}>
          <TextField label="Name" fullWidth value={form.name} onChange={(e) => set('name', e.target.value)} />
          <TextField
            label="Height"
            type="number"
            fullWidth
            value={form.heightCm}
            onChange={(e) => set('heightCm', e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
          />
          <TextField
            label="Target Weight"
            type="number"
            fullWidth
            value={form.targetWeight}
            onChange={(e) => set('targetWeight', e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
          />
          <TextField
            label="Daily Calorie Goal"
            type="number"
            fullWidth
            value={form.calorieGoal}
            onChange={(e) => set('calorieGoal', e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
          />
          <TextField
            label="Protein Goal"
            type="number"
            fullWidth
            value={form.proteinGoal}
            onChange={(e) => set('proteinGoal', e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
          />
          <Button variant="contained" size="large" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </Stack>
      </Card>

      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Data
        </Typography>
        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={handleExport}
          >
            Export Data as JSON
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FileUploadRoundedIcon />}
            onClick={handleImportClick}
          >
            Import Data from JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImportFile}
          />
        </Stack>
      </Card>

      <Card sx={{ p: 2.5, borderColor: 'error.main' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }} color="error.main">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Resetting permanently clears your profile, weight logs, workouts, and checklist history.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="large"
          startIcon={<RestartAltRoundedIcon />}
          onClick={() => setResetOpen(true)}
        >
          Reset Challenge
        </Button>
      </Card>

      <Divider />
      <Typography variant="caption" color="text.secondary" textAlign="center">
        ARISE · All data is stored locally on this device
      </Typography>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset your challenge?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your profile, weight history, workout logs, and daily
            checklists. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmReset}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={savedMsg} autoHideDuration={2500} onClose={() => setSavedMsg(false)}>
        <Alert severity="success" variant="filled" onClose={() => setSavedMsg(false)}>
          Saved successfully
        </Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg(null)}>
        <Alert severity="error" variant="filled" onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
