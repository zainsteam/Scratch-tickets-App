import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

const PrivacyPolicy = ({navigation}: any) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:scratchticketgenie@gmail.com');
  };

  // Section component with flexible content (string or JSX)
  const Section = ({
    title,
    content,
  }: {
    title: string;
    content: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>

      <Text style={styles.paragraph}>
        Welcome to Scratch Ticket Genie, your trusted source for free lottery
        and scratch ticket information. We are committed to protecting your
        privacy and ensuring transparency in how we handle your data. Please
        read this Privacy Policy to understand how we collect, use, and
        safeguard your information.
      </Text>

      <Section
        title="Information Collection and Use"
        content={
          <>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>Personal Information:</Text>
              Scratch Ticket Genie does not collect personally identifiable
              information such as your name, email address, phone number, or
              location.
            </Text>
            {'\n\n'}
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>Device Information:</Text>
              To support app functionality, analytics, and advertising, we
              collect non-personal device information, including: Device ID
              (Advertising ID) Device type and operating system App usage data
              and interaction metrics This data does not directly identify you
              and is used solely for operational and advertising purposes.
              Analytics and Advertising We use third-party services, including
              Firebase and Google Ads, to: Analyze app performance and usage
              trends Deliver relevant advertisements
            </Text>
          </>
        }
      />

      <Section
        title="Data Security"
        content="We implement industry-standard security practices to help protect your information from unauthorized access, alteration, or loss. Your privacy and data integrity are important to us."
      />

      <Section
        title="External Links"
        content="This app may include links to third-party websites (e.g., state lottery sites). We are not responsible for their content or privacy practices. Please review their privacy policies separately."
      />

      <Section
        title="Policy Updates"
        content="We may update this Privacy Policy from time to time. Any changes will be reflected within the app. Continued use of the app means you accept the updated terms."
      />

      <Section
        title="Contact Us"
        content={
          <>
            <Text>
              If you have any questions or concerns about this policy, please
              contact us at:{' '}
              <Text style={styles.link} onPress={handleEmailPress}>
                📧 scratchticketgenie@gmail.com
              </Text>
              .{'\n'}We value your privacy and are here to help.
            </Text>
          </>
        }
      />
    </ScrollView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === 'ios'
      ? {}
      : {
          marginTop: -30,
          backgroundColor: '#f4f4f4',
          // Drop shadow for iOS
          shadowColor: '#000', // Shadow color
          shadowOffset: {width: 0, height: 16}, // Increased offset for better visibility
          shadowOpacity: 1, // Increased opacity for a more defined shadow
          shadowRadius: 8, // Increased blur radius for a softer shadow
          // Drop shadow for Android
          elevation: 10, // Increased elevation for a stronger shadow
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }),
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: '600',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
