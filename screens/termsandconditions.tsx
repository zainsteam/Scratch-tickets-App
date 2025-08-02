import React from 'react';
import {StyleSheet, Text, View, ScrollView, Linking} from 'react-native';

const TermsAndCondition = ({navigation}: any) => {
  const Section = ({
    number,
    title,
    content,
  }: {
    number: number;
    title: string;
    content: string;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {number}. {title}
      </Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Terms and Conditions</Text>

      <Text style={styles.paragraph}>
        Welcome to Scratch Ticket Genie. By accessing and using this mobile
        application, you agree to comply with and be bound by the following
        terms and conditions of use:
      </Text>

      <Section
        number={1}
        title="Purpose of App"
        content="Scratch Ticket Genie is an informational mobile application providing details about scratch tickets and lottery games. We do not guarantee any winning ticket. All information on this app is for informational purposes only and should be used at your discretion."
      />
      <Section
        number={2}
        title="Accuracy Disclaimer"
        content="While we strive to provide accurate and up-to-date information, we do not warrant the accuracy, completeness, or reliability of any information on this app. Any reliance you place on such information is strictly at your own risk."
      />
      <Section
        number={3}
        title="No Warranties"
        content="Scratch Ticket Genie makes no guarantees regarding the accuracy, availability, or performance of any scratch ticket or lottery game listed on this app. We do not guarantee any specific outcomes from using the information provided."
      />
      <Section
        number={4}
        title="Account Registration"
        content="To access features of the app, users may be required to register an account using their name and email address. By creating an account, you agree to provide accurate and complete information and to keep your login credentials secure. You are solely responsible for all activities that occur under your account. Scratch Ticket Genie reserves the right to suspend or terminate accounts for violation of these terms or any unauthorized use."
      />
      <Section
        number={5}
        title="User Responsibilities"
        content="It is your responsibility to verify all information before making any decisions based on the content of this app. Scratch Ticket Genie shall not be liable for any losses or damages incurred as a result of using or relying on the information provided."
      />
      <Section
        number={6}
        title="External Links"
        content="This app may contain links to external websites not controlled or maintained by Scratch Ticket Genie. We do not endorse or accept responsibility for the content, policies, or practices of any third-party websites."
      />
      <Section
        number={7}
        title="Changes to Terms"
        content="Scratch Ticket Genie reserves the right to modify or update these terms and conditions at any time without prior notice. By continuing to use this app after changes are made, you agree to be bound by the revised terms and conditions."
      />
      <Section
        number={8}
        title="Legal Disclaimer"
        content="Nothing on this app constitutes professional advice, whether legal, financial, or otherwise. For specific advice tailored to your situation, consult appropriate professionals."
      />
    </ScrollView>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -30,
    paddingTop: 10,
    paddingHorizontal: 20,
    zIndex: 1000,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
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
});
