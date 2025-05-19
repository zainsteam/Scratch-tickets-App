import React, {useCallback, useEffect, useRef, useState, Fragment} from 'react';
import Svg from 'react-native-svg';
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PathComponent from './path';
import TSpanComponent from './tspan';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {generateStates} from './stateData';
import {fetchStates} from '../providers/apiprovider';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface USState {
  label: string;
  value: string;
  area: string;
  fill: string;
  stroke: string;
  width: string;
  opacity: string;
  fontSize: number;
  x: string;
  y: string;
  textAnchor: string;
  type: string;
}

const DEFAULT_COLOR = '#CCCCCC';
const stroke = '#ffffff';
const strokeWidth = '0.564';
const strokeOpacity = '0.5';
const fontSize = 6;
const textAnchor = 'middle';

const Map2Component = ({type, navigation}: any) => {
  const [states, setStates] = useState<USState[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastTapRef = useRef(0);
  const pickerRef = useRef(null);

  const scale = useSharedValue(1.3);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Gesture Handlers
  const pinchGesture = Gesture.Pinch().onUpdate(e => {
    scale.value = Math.max(1, Math.min(e.scale, 3));
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Store current values as starting point
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = offsetX.value + e.translationX;
      translateY.value = offsetY.value + e.translationY;
    })
    .onEnd(() => {
      translateX.value = withTiming(translateX.value, {duration: 200});
      translateY.value = withTiming(translateY.value, {duration: 200});
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  const handleDoubleTap = useCallback(
    (label: string, type: string) => {
      const now = Date.now();
      if (now - lastTapRef.current < 500 && !isScrolling) {
        navigation.push('Details', {select: label, type});
      }
      lastTapRef.current = now;
    },
    [isScrolling],
  );

  const handlePathClick = useCallback(
    (label: string, type: string) => () => handleDoubleTap(label, type),
    [handleDoubleTap],
  );

  const handleZoomIn = () => {
    scale.value = withTiming(Math.min(scale.value + 0.2, 3), {duration: 200});
  };

  const handleZoomOut = () => {
    scale.value = withTiming(Math.max(scale.value - 0.2, 1), {duration: 200});
  };

  const handleScroll = (event: any) => {
    const {contentOffset} = event.nativeEvent;
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 300);
  };

  useEffect(() => {
    const loadStates = async () => {
      try {
        const apiStates = await fetchStates();
        const apiStatesArray = Array.isArray(apiStates.data)
          ? apiStates.data
          : [];

        const baseStates: USState[] = generateStates(
          type,
          stroke,
          strokeWidth,
          strokeOpacity,
          fontSize,
          textAnchor,
        );

        const mergedStates: USState[] = baseStates.map(state => {
          const match = apiStatesArray.find((s: any) => s.name === state.label);
          return {
            ...state,
            fill: match?.color || DEFAULT_COLOR,
          };
        });

        setStates(mergedStates);
        setSelectedState(mergedStates[0]?.label || '');
      } catch (e) {
        console.error(e);
      }
    };

    const generated = generateStates(
      type,
      stroke,
      strokeWidth,
      strokeOpacity,
      fontSize,
      textAnchor,
    );

    setStates(generated as USState[]);

    if (type === 'Top 10') loadStates();
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      return () => setSelectedState('');
    }, []),
  );

  const StateItem = React.memo(({state}: {state: USState}) => (
    <Fragment>
      <PathComponent
        id={state.label}
        fill={state.fill}
        area={state.area}
        width={state.width}
        opacity={state.opacity}
        stroke={state.stroke}
        onClick={handlePathClick(state.label, state.type)}
      />
      <TSpanComponent
        id={state.label}
        x={state.x}
        y={state.y}
        fontSize={state.fontSize}
        textAnchor={state.textAnchor}
        value={state.value}
        type={state.type}
      />
    </Fragment>
  ));

  return (
    <>
      <Text style={styles.mainHeading}>
        Explore {type} Tickets by Locations
      </Text>
      <Text style={styles.body}>
        Select your state by double tap on the map or choosing from the dropdown
        menu.
      </Text>

      <View style={styles.pickerRow}>
        <Text style={styles.title}>Select the State:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedState}
            dropdownIconColor="black"
            onValueChange={itemValue => {
              if (itemValue && itemValue !== '-') {
                navigation.navigate('Details', {select: itemValue, type});
              }
            }}
            style={styles.picker}>
            <Picker.Item label="Select a state..." value="-" />
            {states.map(state => (
              <Picker.Item
                key={state.label}
                label={state.label}
                value={state.label}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[styles.scrollContent, {paddingLeft: 0}]}>
          <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={animatedStyle}>
                <Svg viewBox="0 0 500 500" height="400" width={width * 1.5}>
                  {states.map((state, index) => (
                    <StateItem key={index} state={state} />
                  ))}
                </Svg>
              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </ScrollView>
        <View style={styles.zoomControls}>
          <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
            <Text style={styles.zoomText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Map2Component;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Optional: Add padding to ensure map doesn't touch the edges of the screen
  },
  container: {
    // backgroundColor: '#f0f0f0',
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: '#333',
    textAlign: 'left',
    marginBottom: 0,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  pickerWrapper: {
    width: '50%',
    borderBottomColor: '#1097ff',
    borderBottomWidth: 2,
    overflow: 'hidden',
  },
  picker: {
    color: 'black',
  },
  scrollContent: {
    flexDirection: 'row',
    // paddingHorizontal: 50,
  },
  zoomControls: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
    backgroundColor: 'rgba(216, 216, 216, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  zoomButton: {
    backgroundColor: '#fff',
    // paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 2,
    borderRadius: 5,
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
