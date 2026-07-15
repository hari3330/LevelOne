import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import { DayStatus } from '../utils/calculations';
import { formatDisplayDate } from '../utils/dateUtils';

interface CalendarGridProps {
  days: DayStatus[];
}

/** Color-coded grid: green = completed, primary outline = today, grey = incomplete/future. */
export default function CalendarGrid({ days }: CalendarGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: 0.75,
      }}
    >
      {days.map((day, i) => {
        let bg = '#E2E8F0'; // incomplete past day
        let color = '#94A3B8';
        if (day.isFuture) {
          bg = '#F1F5F9';
          color = '#CBD5E1';
        }
        if (day.isComplete) {
          bg = '#22C55E';
          color = '#fff';
        }

        return (
          <Tooltip
            key={day.date}
            title={`Day ${day.dayNumber} · ${formatDisplayDate(day.date)}${day.isComplete ? ' · Complete' : ''}`}
            arrow
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.004, 0.3) }}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 8,
                backgroundColor: bg,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                border: day.isToday ? '2px solid #4F46E5' : 'none',
                boxSizing: 'border-box',
              }}
            >
              {day.dayNumber}
            </motion.div>
          </Tooltip>
        );
      })}
    </Box>
  );
}
