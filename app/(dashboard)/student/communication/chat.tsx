  
 import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CheckCheck,
  ChevronLeft,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Sparkles
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";


const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",
  textDark: "#2C1A14",
  textMuted: "#7A6862",
  glassBg: "rgba(255, 255, 255, 0.76)",
};

const chatChannelsPool = [
  {
    id: "CH-01",
    name: "Mrs. Priya Nair",
    role: "Class 4-B Teacher",
    avatarInitial: "PN",
    lastMsg: "Aarav is showing great focus in analytical math today.",
    time: "4 mins ago",
    online: true,
    history: [
      { id: "m1", sender: "teacher", text: "Hello! Just wanted to update you that the science project instructions are posted.", time: "10:14 AM" },
      { id: "m2", sender: "parent", text: "Thank you, Mrs. Priya. We will review them tonight and attach certificates.", time: "10:30 AM" },
      { id: "m3", sender: "teacher", text: "Perfect. Also, Aarav is showing great focus in analytical math today.", time: "02:15 PM" },
    ]
  },
  {
    id: "CH-02",
    name: "Mr. David (Logistics)",
    role: "Transport Controller",
    avatarInitial: "DL",
    lastMsg: "Bus R-101 evening transit route cleared the block safely.",
    time: "2 hrs ago",
    online: false,
    history: [
      { id: "t1", sender: "parent", text: "Is route 101 delayed due to heavy rain junction block?", time: "04:10 PM" },
      { id: "t2", sender: "teacher", text: "Bus R-101 evening transit route cleared the block safely.", time: "04:35 PM" },
    ]
  },
  {
    id: "CH-03",
    name: "Dr. Ramesh",
    role: "Dean of Administration",
    avatarInitial: "DR",
    lastMsg: "The Q2 term evaluation matrix tables have been uploaded.",
    time: "1 day ago",
    online: true,
    history: [
      { id: "d1", sender: "teacher", text: "The Q2 term evaluation matrix tables have been uploaded.", time: "Yesterday" }
    ]
  }
];

export default function CommunicationChatDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState<any>(chatChannelsPool[0]);
  const [typedMessage, setTypedMessage] = useState("");
  
  // Mobile stack view contextual switch toggle hook
  const [mobileActiveChatView, setMobileActiveChatView] = useState(false);

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // 3D Parallax Non-Auto Floating Vectors Management 
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const newMsgObj = {
      id: `local-${Date.now()}`,
      sender: "parent",
      text: typedMessage,
      time: "07:40 PM"
    };
    
    // Dynamically pushing into thread state context mock array
    const updatedHistory = [...activeChannel.history, newMsgObj];
    setActiveChannel({ ...activeChannel, history: updatedHistory });
    setTypedMessage("");
  };

  const handleSelectChannel = (channel: any) => {
    setActiveChannel(channel);
    if (!isDesktop) {
      setMobileActiveChatView(true);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Interpolations configurations matching manual finger scroll input paths
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [30, 0, -75],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [-20, 0, 55],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  const filteredChannels = chatChannelsPool.filter(ch =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Fluids Graphic Canvas Overlay */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}>
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(160, 82, 45, 0.04)"
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      {/* Conditional Stack Switch checking mobile active chat loop state */}
      {(!isDesktop && mobileActiveChatView) ? (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.chatWindowCoreBodyWrapper}>
            {/* Header sub-row navigation controller back btn */}
            <View style={styles.chatHeaderTopBarRow}>
              <TouchableOpacity onPress={() => setMobileActiveChatView(false)} style={styles.chatBackMiniBtn}>
                <ChevronLeft size={20} color={THEME.textDark} />
              </TouchableOpacity>
              <View style={styles.chatHeaderAvatarCircle}>
                <Text style={styles.chatAvatarTextLabel}>{activeChannel.avatarInitial}</Text>
                {activeChannel.online && <View style={styles.onlineDotPulse} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.chatHeaderMainTitleName} numberOfLines={1}>{activeChannel.name}</Text>
                <Text style={styles.chatHeaderSubRoleText} numberOfLines={1}>{activeChannel.role}</Text>
              </View>
            </View>

            {/* Manual Scroll Message Streams Holder List Container */}
            <ScrollView style={styles.messagesScrollCoreArea} showsVerticalScrollIndicator={false}>
              {activeChannel.history.map((msg: any) => {
                const isParent = msg.sender === "parent";
                return (
                  <View key={msg.id} style={[styles.messageBubbleLineRow, isParent ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
                    <View style={[styles.messageBubbleBoxCell, isParent ? styles.parentBubbleStyleBox : styles.teacherBubbleStyleBox]}>
                      <Text style={[styles.messageBubbleTextStringText, isParent ? { color: THEME.white } : { color: THEME.textDark }]}>
                        {msg.text}
                      </Text>
                      <View style={styles.messageBubbleTimeAnchorRow}>
                        <Text style={[styles.messageBubbleTimeLabelText, isParent ? { color: "#FEECE9" } : { color: THEME.textMuted }]}>{msg.time}</Text>
                        {isParent && <CheckCheck size={12} color="#E7F9EE" style={{ marginLeft: 4 }} />}
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Input Form Toolbar Control Element */}
            <View style={[styles.chatInputControlBottomToolbar, { marginBottom: isDesktop ? 0 : 64 }]}>
              <TouchableOpacity style={styles.inputPaperclipMiniBtn}>
                <Paperclip size={18} color={THEME.textMuted} />
              </TouchableOpacity>
              <TextInput
                style={styles.inputMessageTextFieldControl}
                placeholder="Type your message context logs entry..."
                placeholderTextColor={THEME.textMuted}
                value={typedMessage}
                onChangeText={setTypedMessage}
              />
              <TouchableOpacity style={styles.inputSendMessageSubmitBtn} onPress={handleSendMessage}>
                <Send size={16} color={THEME.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
            { useNativeDriver: true }
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={isDesktop ? styles.desktopCenter : null}
        >
          <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
            
            {/* Top Main Section Header Block Branding */}
            <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.headerLeftCluster}>
                <View style={styles.titleBadgeInlineRow}>
                  <Text style={styles.pageTitleHeading}>Teacher Interaction Desk</Text>
                  <View style={styles.liveBroadcastBadge}>
                    <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                    <Text style={styles.liveBroadcastBadgeText}>Secure Sync</Text>
                  </View>
                </View>
                <Text style={styles.pageSubtitleMuted}>Advance Administration cryptographic parent-teacher messaging matrix ledger</Text>
              </View>
              <View style={styles.headerIconCircleBackdrop}>
                <MessageSquare size={20} color={THEME.white} />
              </View>
            </Animated.View>

            {/* Core Responsive Split Screen Execution Grid Layout Frame */}
            <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
              
              {/* Left Box Split Window Panel: Search & Channels Channels List Feed */}
              <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopChannelsPaneWidth]}>
                <Text style={styles.blockTitleLabelHeading}>Active Communication Channels</Text>
                
                <View style={styles.searchBarWrapperBackdropControl}>
                  <Search size={15} color={THEME.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInputControlField}
                    placeholder="Search channel teachers logs..."
                    placeholderTextColor={THEME.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {filteredChannels.map((channelItem) => {
                  const isSelected = activeChannel?.id === channelItem.id;
                  return (
                    <TouchableOpacity
                      key={channelItem.id}
                      style={[styles.channelListItemCardUnitRow, isSelected && isDesktop && styles.selectedChannelListItemCardUnitRow]}
                      onPress={() => handleSelectChannel(channelItem)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.channelAvatarClusterCircle}>
                        <Text style={styles.channelAvatarInitialsTextLabel}>{channelItem.avatarInitial}</Text>
                        {channelItem.online && <View style={styles.onlineStatusMarkerCircleDot} />}
                      </View>

                      <View style={styles.channelItemTextsClusterMainLeftBlock}>
                        <View style={styles.channelItemNameTimeFlexRowLine}>
                          <Text style={styles.channelItemInstructorNameText} numberOfLines={1}>{channelItem.name}</Text>
                          <Text style={styles.channelItemTimestampTextString}>{channelItem.time}</Text>
                        </View>
                        <Text style={styles.channelItemRoleLabelTextSpec} numberOfLines={1}>{channelItem.role}</Text>
                        <Text style={styles.channelItemMsgExcerptSnippetLine} numberOfLines={1}>{channelItem.lastMsg}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Right Box Split Window Panel: Desktop Explicit Chat Window Layout Stream Viewport */}
              {isDesktop && activeChannel && (
                <View style={styles.desktopChatViewportHolderCardBox}>
                  <View style={styles.chatHeaderTopBarRow}>
                    <View style={styles.chatHeaderAvatarCircle}>
                      <Text style={styles.chatAvatarTextLabel}>{activeChannel.avatarInitial}</Text>
                      {activeChannel.online && <View style={styles.onlineDotPulse} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.chatHeaderMainTitleName}>{activeChannel.name}</Text>
                      <Text style={styles.chatHeaderSubRoleText}>{activeChannel.role}</Text>
                    </View>
                  </View>

                  <ScrollView style={styles.messagesScrollCoreArea} showsVerticalScrollIndicator={false}>
                    {activeChannel.history.map((msg: any) => {
                      const isParent = msg.sender === "parent";
                      return (
                        <View key={msg.id} style={[styles.messageBubbleLineRow, isParent ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
                          <View style={[styles.messageBubbleBoxCell, isParent ? styles.parentBubbleStyleBox : styles.teacherBubbleStyleBox]}>
                            <Text style={[styles.messageBubbleTextStringText, isParent ? { color: THEME.white } : { color: THEME.textDark }]}>
                              {msg.text}
                            </Text>
                            <View style={styles.messageBubbleTimeAnchorRow}>
                              <Text style={[styles.messageBubbleTimeLabelText, isParent ? { color: "#FEECE9" } : { color: THEME.textMuted }]}>{msg.time}</Text>
                              {isParent && <CheckCheck size={12} color="#E7F9EE" style={{ marginLeft: 4 }} />}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.chatInputControlBottomToolbar}>
                    <TouchableOpacity style={styles.inputPaperclipMiniBtn}>
                      <Paperclip size={18} color={THEME.textMuted} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.inputMessageTextFieldControl}
                      placeholder="Type your message context logs entry..."
                      placeholderTextColor={THEME.textMuted}
                      value={typedMessage}
                      onChangeText={setTypedMessage}
                    />
                    <TouchableOpacity style={styles.inputSendMessageSubmitBtn} onPress={handleSendMessage}>
                      <Send size={16} color={THEME.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

            </View>
          </View>
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
    position: "relative",
  },
  fluidBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: -20,
    right: 0,
    zIndex: -2,
    opacity: 0.85,
  },
  orb3DOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(227, 83, 54, 0.06)",
    top: 140,
    right: -40,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(160, 82, 45, 0.04)",
    bottom: 80,
    left: -110,
    zIndex: -1,
  },
  desktopCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrapper: {
    width: "100%",
    paddingBottom: 40,
  },
  desktopWidth: {
    maxWidth: 1140,
    paddingHorizontal: 20,
  },
  pageHeaderBlockCard: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeftCluster: {
    flex: 1,
  },
  titleBadgeInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  pageTitleHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  liveBroadcastBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveBroadcastBadgeText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "700",
  },
  pageSubtitleMuted: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  headerIconCircleBackdrop: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  responsiveSplitMainLayoutFlexContainer: {
    paddingHorizontal: 16,
    marginTop: 22,
    gap: 16,
  },
  rowDirectionLayoutGrid: {
    flexDirection: "row",
  },
  desktopChannelsPaneWidth: {
    flex: 1,
  },
  desktopChatViewportHolderCardBox: {
    flex: 1.6,
    backgroundColor: THEME.white,
    borderRadius: 26,
    height: 520,
    overflow: "hidden",
    shadowColor: THEME.darkAccent,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  listFeedBlockSectionCard: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 26,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  blockTitleLabelHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
    marginBottom: 4,
  },
  searchBarWrapperBackdropControl: {
    backgroundColor: "#FDFCF9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 42,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
    marginBottom: 4,
  },
  searchInputControlField: {
    flex: 1,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "500",
  },
  channelListItemCardUnitRow: {
    backgroundColor: "#FDFCF9",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  selectedChannelListItemCardUnitRow: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.16)",
  },
  channelAvatarClusterCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3ECE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  channelAvatarInitialsTextLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  onlineStatusMarkerCircleDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#16A34A",
    borderWidth: 2,
    borderColor: THEME.white,
  },
  channelItemTextsClusterMainLeftBlock: {
    flex: 1,
    marginLeft: 14,
    gap: 2,
  },
  channelItemNameTimeFlexRowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelItemInstructorNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
  },
  channelItemTimestampTextString: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  channelItemRoleLabelTextSpec: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: "600",
  },
  channelItemMsgExcerptSnippetLine: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  chatWindowCoreBodyWrapper: {
    flex: 1,
    backgroundColor: THEME.white,
    
  },
  chatHeaderTopBarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    backgroundColor: THEME.white,
  },
  chatBackMiniBtn: {
    padding: 6,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: "#FDFCF9",
  },
  chatHeaderAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3ECE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  chatAvatarTextLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  onlineDotPulse: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
    borderWidth: 1.5,
    borderColor: THEME.white,
  },
  chatHeaderMainTitleName: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textDark,
  },
  chatHeaderSubRoleText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 1,
  },
  messagesScrollCoreArea: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FDFDFB",
  },
  messageBubbleLineRow: {
    flexDirection: "row",
    marginBottom: 12,
    width: "100%",
  },
  messageBubbleBoxCell: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  parentBubbleStyleBox: {
    backgroundColor: THEME.primary,
    borderBottomRightRadius: 4,
  },
  teacherBubbleStyleBox: {
    backgroundColor: "#F3ECE7",
    borderBottomLeftRadius: 4,
  },
  messageBubbleTextStringText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  messageBubbleTimeAnchorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  messageBubbleTimeLabelText: {
    fontSize: 10,
  },
  chatInputControlBottomToolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    backgroundColor: THEME.white,
    //marginBottom: isDesktop ? 0 : 32,
    gap: 10,
  },
  inputPaperclipMiniBtn: {
    padding: 6,
  },
  inputMessageTextFieldControl: {
    flex: 1,
    backgroundColor: "#FDFCF9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 40,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
  },
  inputSendMessageSubmitBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
