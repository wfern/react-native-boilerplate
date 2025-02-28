import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  AnimatedRef,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { logoutDialog } from '@/providers/authentication';
import { useNavigation } from '@react-navigation/native';
import { EditIcon, LogOutIcon, UserIcon } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { User } from '@/redux/reducers/authentication';
import { useAppSelector } from '@/redux/store';
import {
  DefinitionList,
  DefinitionListDescription,
  DefinitionListLabel,
  DefinitionListTitle,
} from '@/components/definition-list';
import { Divider } from '@/components/divider';
import {
  Header,
  HeaderButton,
  HeaderDescription,
  HeaderTitle,
} from '@/components/header';
import { Pressable } from '@/components/pressable';
import { SafeAreaView } from '@/components/safe-area-view';

const HEADER_MIN_HEIGHT = 80;
const HEADER_MAX_HEIGHT = 220;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export function Account() {
  const navigation = useNavigation();

  const user = useAppSelector((state) => state.authentication.user);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [scrollContentHeight, setScrollContentHeight] = React.useState(0);

  let scrollDistance = scrollContentHeight - scrollHeight;
  if (scrollDistance < 0) {
    scrollDistance = 0;
  } else if (scrollDistance > HEADER_SCROLL_DISTANCE) {
    scrollDistance = HEADER_SCROLL_DISTANCE;
  }

  const handleEditPress = () => {
    navigation.navigate('Account/Edit', {});
  };

  return (
    <SafeAreaView>
      <Header>
        <View className="flex-1">
          <HeaderTitle>Sua conta</HeaderTitle>
          <HeaderDescription>
            Gerencie suas informações e preferências da conta
          </HeaderDescription>
        </View>
        <HeaderButton onPress={logoutDialog}>
          <LogOutIcon color={colors.primaryForeground} />
        </HeaderButton>
      </Header>
      {user && (
        <View className="flex-1">
          <AnimatedHeader
            user={user}
            scrollRef={scrollRef}
            scrollDistance={scrollDistance}
          />
          <Animated.ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName="p-5"
            contentContainerStyle={{
              paddingTop: HEADER_MAX_HEIGHT + 16,
            }}
            scrollEventThrottle={16}
            onLayout={(event) => {
              setScrollHeight(event.nativeEvent.layout.height);
            }}
            onContentSizeChange={(width, height) => {
              setScrollContentHeight(height);
            }}
          >
            <View className="flex flex-row items-center justify-between gap-4">
              <DefinitionListLabel>Informações</DefinitionListLabel>
              <Pressable
                hitSlop={16}
                className="mb-1 px-4"
                onPress={handleEditPress}
              >
                <EditIcon size={20} color={colors.primary} />
              </Pressable>
            </View>
            <DefinitionList>
              <DefinitionListTitle>E-mail</DefinitionListTitle>
              <DefinitionListDescription>
                {user.email}
              </DefinitionListDescription>
              <Divider />
              <DefinitionListTitle>Telefone</DefinitionListTitle>
              <DefinitionListDescription>
                {user.phone}
              </DefinitionListDescription>
              <Divider />
              <DefinitionListTitle>Documento</DefinitionListTitle>
              <DefinitionListDescription>
                {user.document_number ?? '-'}
              </DefinitionListDescription>
              <Divider />
              <DefinitionListTitle>Endereço</DefinitionListTitle>
              <DefinitionListDescription>
                {user.address ?? '-'}
              </DefinitionListDescription>
              <Divider />
              <DefinitionListTitle>Instagram</DefinitionListTitle>
              <DefinitionListDescription>-</DefinitionListDescription>
              <Divider />
              <DefinitionListTitle>Facebook</DefinitionListTitle>
              <DefinitionListDescription>-</DefinitionListDescription>
              {/* {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <Divider />
                  <DefinitionListTitle>Lorem ipsum</DefinitionListTitle>
                  <DefinitionListDescription>
                    Lorem ipsum dolor
                  </DefinitionListDescription>
                </React.Fragment>
              ))} */}
            </DefinitionList>
          </Animated.ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

function useElementSize(
  elementRef: React.RefObject<
    Animated.Text | Animated.View | Animated.ScrollView | View
  >,
) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error
      elementRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setSize({ width, height });
      });
    }, 0);
  }, [elementRef]);

  return size;
}

const AVATAR_MIN_SIZE = 60;
const AVATAR_MAX_SIZE = 120;

function AnimatedHeader({
  user,
  scrollRef,
  scrollDistance,
}: {
  user: User;
  scrollRef: AnimatedRef<Animated.ScrollView>;
  scrollDistance: number;
}) {
  const { width } = useWindowDimensions();

  const scrollY = useScrollViewOffset(scrollRef);

  const titleRef = React.useRef<Animated.Text>(null);
  const descriptionRef = React.useRef<Animated.Text>(null);

  const titleSize = useElementSize(titleRef);
  const descriptionSize = useElementSize(descriptionRef);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP,
    );

    const borderBottomColor = interpolateColor(
      scrollY.value,
      [0, scrollDistance],
      ['transparent', colors.border],
    );

    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, scrollDistance],
      [colors.navigatorBackground, colors.background],
    );

    return { height, borderBottomColor, backgroundColor };
  });

  const headerAvatarStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [AVATAR_MAX_SIZE, AVATAR_MIN_SIZE],
      Extrapolation.CLAMP,
    );

    const translateX = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [(width - AVATAR_MAX_SIZE) / 2, 20],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [20, 10],
      Extrapolation.CLAMP,
    );

    return {
      width: size,
      height: size,
      transform: [{ translateX }, { translateY }],
    };
  });

  const headerDescriptionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [(width - descriptionSize.width) / 2, 36 + AVATAR_MIN_SIZE],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [25, -20],
      Extrapolation.CLAMP,
    );

    return { transform: [{ translateX }, { translateY }] };
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [(width - titleSize.width) / 2, 36 + AVATAR_MIN_SIZE],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [48, -46],
      Extrapolation.CLAMP,
    );

    const fontSize = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [28, 18],
      Extrapolation.CLAMP,
    );

    return { fontSize, transform: [{ translateX }, { translateY }] };
  });

  return (
    <Animated.View
      className="absolute left-0 right-0 top-0 z-10 border-b bg-navigator"
      style={headerStyle}
    >
      <View>
        <Animated.View
          className="flex items-center justify-center rounded-full border-4 border-white bg-primary"
          style={headerAvatarStyle}
        >
          <UserIcon strokeWidth={1} size="80%" color="white" />
        </Animated.View>
        <View>
          <Animated.Text
            ref={descriptionRef}
            className="absolute text-muted-foreground"
            style={headerDescriptionStyle}
          >
            {user.email}
          </Animated.Text>
          <Animated.Text
            ref={titleRef}
            className="absolute text-3xl font-semibold text-foreground"
            style={headerTitleStyle}
          >
            {user.name}
          </Animated.Text>
        </View>
      </View>
    </Animated.View>
  );
}
