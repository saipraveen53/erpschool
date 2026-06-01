import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Star } from "lucide-react-native";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#A0522D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Recent Feedback</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.card}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} color="#facc15" fill="#facc15" />)}
            </View>
            <Text style={styles.title}>"Great Infrastructure and Education Quality"</Text>
            <Text style={styles.desc}>The system has drastically improved our ability to track student performance and attendance. The UI is very intuitive and fast.</Text>
            <Text style={styles.meta}>Submitted by Greenwood High • 2 days ago</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { flexDirection: "row", alignItems: "center", padding: isMobile ? 16 : 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: isMobile ? 18 : 20, fontWeight: "bold", color: "#A0522D" },
  content: { padding: isMobile ? 16 : 24 },
  card: { backgroundColor: "#fff", padding: isMobile ? 16 : 24, borderRadius: 16, marginBottom: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  stars: { flexDirection: "row", marginBottom: 12 },
  title: { fontSize: isMobile ? 15 : 18, fontWeight: "bold", color: "#A0522D", marginBottom: 8 },
  desc: { fontSize: isMobile ? 13 : 15, color: "#705244", lineHeight: 22, marginBottom: 16 },
  meta: { fontSize: 13, color: "#B8A095" }
});
