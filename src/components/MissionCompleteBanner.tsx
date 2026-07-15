import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';

export default function MissionCompleteBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: '#fff',
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -6, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CelebrationRoundedIcon sx={{ fontSize: 30 }} />
        </motion.div>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Mission Complete
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Great work!
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
