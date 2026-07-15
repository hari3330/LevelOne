import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { Habit } from '../types';
import { todayISO } from '../utils/dateUtils';

export interface HabitFormValues {
  name: string;
  quitDate: string;
  notes: string;
}

interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: HabitFormValues) => void;
  /** When provided, the dialog edits this habit instead of creating a new one. */
  habit?: Habit | null;
}

/** Shared dialog for both "Add Habit" (FAB) and "Edit Habit" (card menu) flows. */
export default function AddHabitDialog({ open, onClose, onSave, habit }: AddHabitDialogProps) {
  const isEdit = !!habit;
  const [name, setName] = useState('');
  const [quitDate, setQuitDate] = useState(todayISO());
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  // Reset (or pre-fill, for edit) the form every time the dialog opens.
  useEffect(() => {
    if (open) {
      setName(habit?.name ?? '');
      setQuitDate(habit?.quitDate ?? todayISO());
      setNotes(habit?.notes ?? '');
      setTouched(false);
    }
  }, [open, habit]);

  const isValid = name.trim().length > 0 && quitDate.length > 0;

  function handleSave() {
    setTouched(true);
    if (!isValid) return;
    onSave({ name, quitDate, notes });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Habit' : 'Add Habit'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Habit Name"
            placeholder="e.g. Smoking, Social Media"
            fullWidth
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={touched && name.trim().length === 0}
            helperText={touched && name.trim().length === 0 ? 'Enter a habit name' : ' '}
          />
          <TextField
            label="Quit Date"
            type="date"
            fullWidth
            value={quitDate}
            onChange={(e) => setQuitDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            error={touched && !quitDate}
            helperText={touched && !quitDate ? 'Required' : ' '}
          />
          <TextField
            label="Notes (optional)"
            placeholder="Why you're quitting, triggers to avoid, etc."
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {isEdit ? 'Save Changes' : 'Add Habit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
