import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { fontSizes, spacing } from '../utils/sizes';

const minutesToMillis = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 1, isPaused, onProgress, onEnd }) => {
  const [millis, setMillis] = useState(minutesToMillis(minutes));

  const interval = React.useRef(null);

   const counting = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current)
        return time;
      }
      const timeLeft = time - 1000;
      return timeLeft;
    });
  };


  useEffect(() => {
    setMillis(minutesToMillis(minutes))
  }, [minutes])

  useEffect(() => {
   onProgress(millis / minutesToMillis(minutes)) 
   if(millis === 0){
    onEnd()
   }
  }, [millis])

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(counting, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused]);

 

  let minute = Math.floor(millis / 1000 / 60) % 60;
  let seconds = Math.floor(millis / 1000) % 60;

  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
