import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

const DEFAULT_TIME = 0.1;
export default function Timer({ focusSubject, onTimerEnd, clearSubject }) {
  useKeepAwake();

  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const onEnd = () => {
    vibrate();
    onTimerEnd();
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
  };

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  };

  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          onEnd={onEnd}
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View style={styles.progress}>
        <ProgressBar progress={progress} style={{ height: 10 }} />
      </View>
      <View style={styles.button}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={styles.button}>
        {isStarted ? (
          <RoundedButton title="pause" onPress={() => setIsStarted(false)} />
        ) : (
          <RoundedButton title="start" onPress={() => setIsStarted(true)} />
        )}
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="clear" size={50} onPress={() => clearSubject()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  task: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  progress: {
    paddingTop: spacing.md,
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25
  }
});
