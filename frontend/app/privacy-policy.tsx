import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#45BFD0', '#2B9EB3']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>PRIVACY POLICY</Text>
          <Text style={styles.updatedDate}>Last updated May 11, 2026</Text>

          <Text style={styles.paragraph}>
            This Privacy Notice for Thoughts ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
          </Text>

          <Text style={styles.bullet}>• Download and use our mobile application (Thoughts), or any other application of ours that links to this Privacy Notice</Text>
          <Text style={styles.bullet}>• Use Thoughts. A social platform where users can create polls and other users can vote and engage with them.</Text>
          <Text style={styles.bullet}>• Engage with us in other related ways, including any marketing or events</Text>

          <Text style={styles.paragraph}>
            Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at thoughtsapp.support@gmail.com.
          </Text>

          {/* SUMMARY OF KEY POINTS */}
          <Text style={styles.sectionTitle}>SUMMARY OF KEY POINTS</Text>
          <Text style={styles.paragraph}>
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
          </Text>

          <Text style={styles.boldParagraph}>What personal information do we process?</Text>
          <Text style={styles.paragraph}>
            When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
          </Text>

          <Text style={styles.boldParagraph}>Do we process any sensitive personal information?</Text>
          <Text style={styles.paragraph}>
            Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
          </Text>

          <Text style={styles.boldParagraph}>Do we collect any information from third parties?</Text>
          <Text style={styles.paragraph}>We do not collect any information from third parties.</Text>

          <Text style={styles.boldParagraph}>How do we process your information?</Text>
          <Text style={styles.paragraph}>
            We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.
          </Text>

          <Text style={styles.boldParagraph}>In what situations and with which parties do we share personal information?</Text>
          <Text style={styles.paragraph}>
            We may share information in specific situations and with specific third parties.
          </Text>

          <Text style={styles.boldParagraph}>How do we keep your information safe?</Text>
          <Text style={styles.paragraph}>
            We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
          </Text>

          <Text style={styles.boldParagraph}>What are your rights?</Text>
          <Text style={styles.paragraph}>
            Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
          </Text>

          <Text style={styles.boldParagraph}>How do you exercise your rights?</Text>
          <Text style={styles.paragraph}>
            The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
          </Text>

          <Text style={styles.boldParagraph}>Want to learn more about what we do with any information we collect?</Text>
          <Text style={styles.paragraph}>Review the Privacy Notice in full.</Text>

          {/* TABLE OF CONTENTS */}
          <Text style={styles.sectionTitle}>TABLE OF CONTENTS</Text>
          <Text style={styles.tocItem}>1. WHAT INFORMATION DO WE COLLECT?</Text>
          <Text style={styles.tocItem}>2. HOW DO WE PROCESS YOUR INFORMATION?</Text>
          <Text style={styles.tocItem}>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</Text>
          <Text style={styles.tocItem}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Text>
          <Text style={styles.tocItem}>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</Text>
          <Text style={styles.tocItem}>6. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>
          <Text style={styles.tocItem}>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>
          <Text style={styles.tocItem}>8. DO WE COLLECT INFORMATION FROM MINORS?</Text>
          <Text style={styles.tocItem}>9. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
          <Text style={styles.tocItem}>10. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
          <Text style={styles.tocItem}>11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
          <Text style={styles.tocItem}>12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
          <Text style={styles.tocItem}>13. DO WE MAKE UPDATES TO THIS NOTICE?</Text>
          <Text style={styles.tocItem}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
          <Text style={styles.tocItem}>15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>

          {/* SECTION 1 */}
          <Text style={styles.sectionTitle}>1. WHAT INFORMATION DO WE COLLECT?</Text>
          <Text style={styles.subSectionTitle}>Personal information you disclose to us</Text>
          <Text style={styles.inShort}>In Short: We collect personal information that you provide to us.</Text>
          <Text style={styles.paragraph}>
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </Text>
          <Text style={styles.boldParagraph}>Personal Information Provided by You.</Text>
          <Text style={styles.paragraph}>
            The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </Text>
          <Text style={styles.bullet}>• names</Text>
          <Text style={styles.bullet}>• email addresses</Text>
          <Text style={styles.bullet}>• usernames</Text>
          <Text style={styles.bullet}>• passwords</Text>
          <Text style={styles.bullet}>• contact preferences</Text>
          <Text style={styles.bullet}>• contact or authentication data</Text>

          <Text style={styles.boldParagraph}>Sensitive Information.</Text>
          <Text style={styles.paragraph}>We do not process sensitive information.</Text>

          <Text style={styles.boldParagraph}>Social Media Login Data.</Text>
          <Text style={styles.paragraph}>
            We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.
          </Text>

          <Text style={styles.boldParagraph}>Application Data.</Text>
          <Text style={styles.paragraph}>
            If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
          </Text>
          <Text style={styles.bullet}>• Push Notifications. We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.</Text>

          <Text style={styles.paragraph}>
            This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
          </Text>
          <Text style={styles.paragraph}>
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </Text>

          <Text style={styles.boldParagraph}>Google API</Text>
          <Text style={styles.paragraph}>
            Our use of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.
          </Text>

          {/* SECTION 2 */}
          <Text style={styles.sectionTitle}>2. HOW DO WE PROCESS YOUR INFORMATION?</Text>
          <Text style={styles.inShort}>
            In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
          </Text>
          <Text style={styles.paragraph}>
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
          </Text>
          <Text style={styles.bullet}>• To facilitate account creation and authentication and otherwise manage user accounts.</Text>
          <Text style={styles.bullet}>• To deliver and facilitate delivery of services to the user.</Text>
          <Text style={styles.bullet}>• To respond to user inquiries/offer support to users.</Text>
          <Text style={styles.bullet}>• To send administrative information to you.</Text>
          <Text style={styles.bullet}>• To fulfill and manage your orders.</Text>
          <Text style={styles.bullet}>• To enable user-to-user communications.</Text>
          <Text style={styles.bullet}>• To request feedback.</Text>
          <Text style={styles.bullet}>• To save or protect an individual's vital interest.</Text>

          {/* SECTION 3 */}
          <Text style={styles.sectionTitle}>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</Text>
          <Text style={styles.inShort}>
            In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.
          </Text>
          <Text style={styles.paragraph}>
            If you are located in the EU or UK, the General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases:
          </Text>
          <Text style={styles.bullet}>• Consent. We may process your information if you have given us permission to use your personal information for a specific purpose. You can withdraw your consent at any time.</Text>
          <Text style={styles.bullet}>• Performance of a Contract. We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you.</Text>
          <Text style={styles.bullet}>• Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests.</Text>
          <Text style={styles.bullet}>• Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations.</Text>
          <Text style={styles.bullet}>• Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party.</Text>

          <Text style={styles.paragraph}>
            If you are located in Canada, we may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.
          </Text>

          {/* SECTION 4 */}
          <Text style={styles.sectionTitle}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Text>
          <Text style={styles.inShort}>
            In Short: We may share information in specific situations described in this section and/or with the following third parties.
          </Text>
          <Text style={styles.bullet}>• Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</Text>
          <Text style={styles.bullet}>• Other Users. When you share personal information or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity.</Text>

          {/* SECTION 5 */}
          <Text style={styles.sectionTitle}>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</Text>
          <Text style={styles.inShort}>
            In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.
          </Text>
          <Text style={styles.paragraph}>
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
          </Text>
          <Text style={styles.paragraph}>
            We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider.
          </Text>

          {/* SECTION 6 */}
          <Text style={styles.sectionTitle}>6. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>
          <Text style={styles.inShort}>
            In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
          </Text>
          <Text style={styles.paragraph}>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
          </Text>
          <Text style={styles.paragraph}>
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible, then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </Text>

          {/* SECTION 7 */}
          <Text style={styles.sectionTitle}>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>
          <Text style={styles.inShort}>
            In Short: We aim to protect your personal information through a system of organizational and technical security measures.
          </Text>
          <Text style={styles.paragraph}>
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
          </Text>

          {/* SECTION 8 */}
          <Text style={styles.sectionTitle}>8. DO WE COLLECT INFORMATION FROM MINORS?</Text>
          <Text style={styles.inShort}>
            In Short: We do not knowingly collect data from or market to children under 18 years of age.
          </Text>
          <Text style={styles.paragraph}>
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at thoughtsapp.support@gmail.com.
          </Text>

          {/* SECTION 9 */}
          <Text style={styles.sectionTitle}>9. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
          <Text style={styles.inShort}>
            In Short: Depending on your state of residence in the US or in some regions, such as the EEA, UK, Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information.
          </Text>
          <Text style={styles.paragraph}>
            In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.
          </Text>
          <Text style={styles.paragraph}>
            We will consider and act upon any request in accordance with applicable data protection laws.
          </Text>

          <Text style={styles.boldParagraph}>Withdrawing your consent:</Text>
          <Text style={styles.paragraph}>
            If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us using the contact details provided below.
          </Text>

          <Text style={styles.boldParagraph}>Opting out of marketing and promotional communications:</Text>
          <Text style={styles.paragraph}>
            You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us. You will then be removed from the marketing lists. However, we may still communicate with you for service-related purposes.
          </Text>

          <Text style={styles.boldParagraph}>Account Information</Text>
          <Text style={styles.paragraph}>
            If you would at any time like to review or change the information in your account or terminate your account, you can log in to your account settings and update your user account.
          </Text>
          <Text style={styles.paragraph}>
            If you have questions or comments about your privacy rights, you may email us at thoughtsapp.support@gmail.com.
          </Text>

          {/* SECTION 10 */}
          <Text style={styles.sectionTitle}>10. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
          <Text style={styles.paragraph}>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
          </Text>

          {/* SECTION 11 */}
          <Text style={styles.sectionTitle}>11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
          <Text style={styles.inShort}>
            In Short: If you are a resident of certain US states, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.
          </Text>
          <Text style={styles.paragraph}>
            We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.
          </Text>

          <Text style={styles.boldParagraph}>Your Rights</Text>
          <Text style={styles.bullet}>• Right to know whether or not we are processing your personal data</Text>
          <Text style={styles.bullet}>• Right to access your personal data</Text>
          <Text style={styles.bullet}>• Right to correct inaccuracies in your personal data</Text>
          <Text style={styles.bullet}>• Right to request the deletion of your personal data</Text>
          <Text style={styles.bullet}>• Right to obtain a copy of the personal data you previously shared with us</Text>
          <Text style={styles.bullet}>• Right to non-discrimination for exercising your rights</Text>
          <Text style={styles.bullet}>• Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling</Text>

          <Text style={styles.boldParagraph}>How to Exercise Your Rights</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, you can contact us by submitting a data subject access request, by emailing us at thoughtsapp.support@gmail.com, or by referring to the contact details at the bottom of this document.
          </Text>

          {/* SECTION 12 */}
          <Text style={styles.sectionTitle}>12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
          <Text style={styles.inShort}>
            In Short: You may have additional rights based on the country you reside in.
          </Text>

          <Text style={styles.boldParagraph}>Australia and New Zealand</Text>
          <Text style={styles.paragraph}>
            We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).
          </Text>

          <Text style={styles.boldParagraph}>Republic of South Africa</Text>
          <Text style={styles.paragraph}>
            At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us using the contact details provided below.
          </Text>

          {/* SECTION 13 */}
          <Text style={styles.sectionTitle}>13. DO WE MAKE UPDATES TO THIS NOTICE?</Text>
          <Text style={styles.inShort}>
            In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.
          </Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </Text>

          {/* SECTION 14 */}
          <Text style={styles.sectionTitle}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
          <Text style={styles.paragraph}>
            If you have questions or comments about this notice, you may email us at thoughtsapp.support@gmail.com or contact us by post at:
          </Text>
          <Text style={styles.paragraph}>
            Thoughts{'\n'}
            26c/1a, Kamaraj Nagar, 3rd Mile{'\n'}
            Tuticorin, Tamil Nadu 628008{'\n'}
            India
          </Text>

          {/* SECTION 15 */}
          <Text style={styles.sectionTitle}>15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>
          <Text style={styles.paragraph}>
            Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  updatedDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B9EB3',
    marginTop: 24,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inShort: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#45BFD0',
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 10,
  },
  boldParagraph: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 4,
    paddingLeft: 12,
  },
  tocItem: {
    fontSize: 13,
    color: '#2B9EB3',
    marginBottom: 6,
    paddingLeft: 8,
  },
});
