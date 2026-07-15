import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { motion } from 'framer-motion';

interface ChecklistItemProps {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

/** One row of the daily mission checklist, with a satisfying bounce when checked. */
export default function ChecklistItem({ label, description, checked, onToggle }: ChecklistItemProps) {
  return (
    <ButtonBase
      onClick={onToggle}
      sx={{
        width: '100%',
        borderRadius: 3,
        p: 1.5,
        justifyContent: 'flex-start',
        textAlign: 'left',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
        <motion.div
          animate={{ scale: checked ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: checked ? 'none' : '2px solid #CBD5E1',
            backgroundColor: checked ? '#4F46E5' : 'transparent',
          }}
        >
          {checked && <CheckRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />}
        </motion.div>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              textDecoration: checked ? 'line-through' : 'none',
              color: checked ? 'text.secondary' : 'text.primary',
            }}
          >
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {description}
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}
