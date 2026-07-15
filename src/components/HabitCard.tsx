import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { motion } from 'framer-motion';

import { Habit } from '../types';
import { calcCurrentStreak, calcLongestStreak, calcStatus } from '../utils/habitCalculations';
import { formatLongDate } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
  onRelapse: () => void;
}

export default function HabitCard({ habit, onEdit, onDelete, onRelapse }: HabitCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [relapseConfirmOpen, setRelapseConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const currentStreak = calcCurrentStreak(habit);
  const longestStreak = calcLongestStreak(habit);
  const status = calcStatus(habit);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {habit.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Quit on {formatLongDate(habit.quitDate)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={status}
              color={status === 'Active' ? 'success' : 'error'}
              variant={status === 'Active' ? 'filled' : 'outlined'}
            />
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Large streak counter */}
        <Box sx={{ textAlign: 'center', my: 2.5 }}>
          <motion.div
            key={currentStreak}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <Typography variant="h2" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
              {currentStreak}
            </Typography>
          </motion.div>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {currentStreak === 1 ? 'Day Clean' : 'Days Clean'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mb: habit.notes ? 1.5 : 2 }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.25,
              borderRadius: 2.5,
              bgcolor: '#F1F5F9',
            }}
          >
            <EmojiEventsRoundedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Longest Streak
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.25,
              borderRadius: 2.5,
              bgcolor: '#F1F5F9',
            }}
          >
            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Relapses
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {habit.relapseDates.length}
              </Typography>
            </Box>
          </Box>
        </Stack>

        {habit.notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: 'italic', wordBreak: 'break-word' }}
          >
            "{habit.notes}"
          </Typography>
        )}

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<ReplayRoundedIcon />}
          onClick={() => setRelapseConfirmOpen(true)}
        >
          Relapse
        </Button>
      </Card>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onEdit();
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setDeleteConfirmOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Remove</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={relapseConfirmOpen} onClose={() => setRelapseConfirmOpen(false)}>
        <DialogTitle>Log a relapse?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your streak for "{habit.name}" will reset to 0 and today will be saved as a relapse
            date. Your longest streak is kept.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRelapseConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setRelapseConfirmOpen(false);
              onRelapse();
            }}
          >
            Confirm Relapse
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Remove "{habit.name}"?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This permanently deletes this habit and its full relapse history. This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteConfirmOpen(false);
              onDelete();
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
