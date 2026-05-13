import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#45BFD0', '#2B9EB3']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>TERMS OF USE</Text>
          <Text style={styles.updatedDate}>Last updated May 12, 2026</Text>

          {/* AGREEMENT */}
          <Text style={styles.sectionTitle}>AGREEMENT TO OUR LEGAL TERMS</Text>
          <Text style={styles.paragraph}>
            We are Thoughts, doing business as Thoughts ("Company," "we," "us," "our"), a company registered in India at 26c/1a, Kamaraj Nagar, 3rd Mile, Tuticorin, Tamil Nadu 628008.
          </Text>
          <Text style={styles.paragraph}>
            We operate the mobile application Thoughts (the "App"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </Text>
          <Text style={styles.paragraph}>
            A social platform where users can create polls and the community can vote and engage with them.
          </Text>
          <Text style={styles.paragraph}>
            You can contact us by phone at +91 63807 75 229, email at thoughtsapp.support@gmail.com, or by mail to 26c/1a, Kamaraj Nagar, 3rd Mile, Tuticorin, Tamil Nadu 628008, India.
          </Text>
          <Text style={styles.paragraph}>
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Thoughts, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </Text>
          <Text style={styles.paragraph}>
            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change.
          </Text>
          <Text style={styles.paragraph}>
            The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.
          </Text>

          {/* TABLE OF CONTENTS */}
          <Text style={styles.sectionTitle}>TABLE OF CONTENTS</Text>
          <Text style={styles.tocItem}>1. OUR SERVICES</Text>
          <Text style={styles.tocItem}>2. INTELLECTUAL PROPERTY RIGHTS</Text>
          <Text style={styles.tocItem}>3. USER REPRESENTATIONS</Text>
          <Text style={styles.tocItem}>4. USER REGISTRATION</Text>
          <Text style={styles.tocItem}>5. PROHIBITED ACTIVITIES</Text>
          <Text style={styles.tocItem}>6. USER GENERATED CONTRIBUTIONS</Text>
          <Text style={styles.tocItem}>7. CONTRIBUTION LICENSE</Text>
          <Text style={styles.tocItem}>8. GUIDELINES FOR REVIEWS</Text>
          <Text style={styles.tocItem}>9. MOBILE APPLICATION LICENSE</Text>
          <Text style={styles.tocItem}>10. SERVICES MANAGEMENT</Text>
          <Text style={styles.tocItem}>11. PRIVACY POLICY</Text>
          <Text style={styles.tocItem}>12. COPYRIGHT INFRINGEMENTS</Text>
          <Text style={styles.tocItem}>13. TERM AND TERMINATION</Text>
          <Text style={styles.tocItem}>14. MODIFICATIONS AND INTERRUPTIONS</Text>
          <Text style={styles.tocItem}>15. GOVERNING LAW</Text>
          <Text style={styles.tocItem}>16. DISPUTE RESOLUTION</Text>
          <Text style={styles.tocItem}>17. CORRECTIONS</Text>
          <Text style={styles.tocItem}>18. DISCLAIMER</Text>
          <Text style={styles.tocItem}>19. LIMITATIONS OF LIABILITY</Text>
          <Text style={styles.tocItem}>20. INDEMNIFICATION</Text>
          <Text style={styles.tocItem}>21. USER DATA</Text>
          <Text style={styles.tocItem}>22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Text>
          <Text style={styles.tocItem}>23. CALIFORNIA USERS AND RESIDENTS</Text>
          <Text style={styles.tocItem}>24. MISCELLANEOUS</Text>
          <Text style={styles.tocItem}>25. CONTACT US</Text>

          {/* SECTION 1 */}
          <Text style={styles.sectionTitle}>1. OUR SERVICES</Text>
          <Text style={styles.paragraph}>
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
          </Text>
          <Text style={styles.paragraph}>
            The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
          </Text>

          {/* SECTION 2 */}
          <Text style={styles.sectionTitle}>2. INTELLECTUAL PROPERTY RIGHTS</Text>
          <Text style={styles.subSectionTitle}>Our intellectual property</Text>
          <Text style={styles.paragraph}>
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
          </Text>
          <Text style={styles.paragraph}>
            Our Content and Marks are protected by copyright and trademark laws and treaties in the United States and around the world.
          </Text>
          <Text style={styles.paragraph}>
            The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
          </Text>

          <Text style={styles.subSectionTitle}>Your use of our Services</Text>
          <Text style={styles.paragraph}>
            Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
          </Text>
          <Text style={styles.bullet}>• access the Services; and</Text>
          <Text style={styles.bullet}>• download or print a copy of any portion of the Content to which you have properly gained access,</Text>
          <Text style={styles.paragraph}>
            solely for your personal, non-commercial use or internal business purpose.
          </Text>
          <Text style={styles.paragraph}>
            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </Text>
          <Text style={styles.paragraph}>
            If you wish to make any use of the Services, Content, or Marks other than as set out in this section, please address your request to: thoughtsapp.support@gmail.com.
          </Text>
          <Text style={styles.paragraph}>
            Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.
          </Text>

          <Text style={styles.subSectionTitle}>Your submissions and contributions</Text>
          <Text style={styles.paragraph}>
            Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.
          </Text>
          <Text style={styles.boldParagraph}>Submissions:</Text>
          <Text style={styles.paragraph}>
            By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission.
          </Text>
          <Text style={styles.boldParagraph}>Contributions:</Text>
          <Text style={styles.paragraph}>
            The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services ("Contributions"). Any Submission that is publicly posted shall also be treated as a Contribution.
          </Text>
          <Text style={styles.paragraph}>
            When you post Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions for any purpose.
          </Text>

          {/* SECTION 3 */}
          <Text style={styles.sectionTitle}>3. USER REPRESENTATIONS</Text>
          <Text style={styles.paragraph}>
            By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means; (6) you will not use the Services for any illegal or unauthorized purpose; and (7) your use of the Services will not violate any applicable law or regulation.
          </Text>

          {/* SECTION 4 */}
          <Text style={styles.sectionTitle}>4. USER REGISTRATION</Text>
          <Text style={styles.paragraph}>
            You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </Text>

          {/* SECTION 5 */}
          <Text style={styles.sectionTitle}>5. PROHIBITED ACTIVITIES</Text>
          <Text style={styles.paragraph}>
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. As a user of the Services, you agree not to:
          </Text>
          <Text style={styles.bullet}>• Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</Text>
          <Text style={styles.bullet}>• Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</Text>
          <Text style={styles.bullet}>• Circumvent, disable, or otherwise interfere with security-related features of the Services.</Text>
          <Text style={styles.bullet}>• Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</Text>
          <Text style={styles.bullet}>• Use any information obtained from the Services in order to harass, abuse, or harm another person.</Text>
          <Text style={styles.bullet}>• Make improper use of our support services or submit false reports of abuse or misconduct.</Text>
          <Text style={styles.bullet}>• Use the Services in a manner inconsistent with any applicable laws or regulations.</Text>
          <Text style={styles.bullet}>• Engage in unauthorized framing of or linking to the Services.</Text>
          <Text style={styles.bullet}>• Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services.</Text>
          <Text style={styles.bullet}>• Engage in any automated use of the system, such as using scripts to send comments or messages.</Text>
          <Text style={styles.bullet}>• Delete the copyright or other proprietary rights notice from any Content.</Text>
          <Text style={styles.bullet}>• Attempt to impersonate another user or person.</Text>
          <Text style={styles.bullet}>• Interfere with, disrupt, or create an undue burden on the Services.</Text>
          <Text style={styles.bullet}>• Harass, annoy, intimidate, or threaten any of our employees or agents.</Text>
          <Text style={styles.bullet}>• Copy or adapt the Services' software.</Text>
          <Text style={styles.bullet}>• Use the Services to advertise or offer to sell goods and services.</Text>
          <Text style={styles.bullet}>• Sell or otherwise transfer your profile.</Text>

          {/* SECTION 6 */}
          <Text style={styles.sectionTitle}>6. USER GENERATED CONTRIBUTIONS</Text>
          <Text style={styles.paragraph}>
            The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary.
          </Text>

          {/* SECTION 7 */}
          <Text style={styles.sectionTitle}>7. CONTRIBUTION LICENSE</Text>
          <Text style={styles.paragraph}>
            By posting your Contributions to any part of the Services, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions for any purpose.
          </Text>
          <Text style={styles.paragraph}>
            We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions.
          </Text>

          {/* SECTION 8 */}
          <Text style={styles.sectionTitle}>8. GUIDELINES FOR REVIEWS</Text>
          <Text style={styles.paragraph}>
            We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity; (3) your reviews should not contain discriminatory references; (4) your reviews should not contain references to illegal activity; (5) you should not be affiliated with competitors if posting negative reviews; (6) you should not make any conclusions as to the legality of conduct; (7) you may not post any false or misleading statements; and (8) you may not organize a campaign encouraging others to post reviews.
          </Text>

          {/* SECTION 9 */}
          <Text style={styles.sectionTitle}>9. MOBILE APPLICATION LICENSE</Text>
          <Text style={styles.subSectionTitle}>Use License</Text>
          <Text style={styles.paragraph}>
            If you access the Services via the App, then we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on wireless electronic devices owned or controlled by you, and to access and use the App on such devices strictly in accordance with the terms and conditions of this mobile application license contained in these Legal Terms.
          </Text>

          <Text style={styles.subSectionTitle}>Apple and Android Devices</Text>
          <Text style={styles.paragraph}>
            The following terms apply when you use the App obtained from either the Apple Store or Google Play (each an "App Distributor") to access the Services: (1) the license granted to you for our App is limited to a non-transferable license to use the application on a device that utilizes the Apple iOS or Android operating systems; (2) we are responsible for providing any maintenance and support services with respect to the App; (3) in the event of any failure of the App to conform to any applicable warranty, you may notify the applicable App Distributor; (4) you represent and warrant that you are not located in a country that is subject to a US government embargo; (5) you must comply with applicable third-party terms of agreement when using the App; and (6) you acknowledge and agree that the App Distributors are third-party beneficiaries of the terms and conditions in this mobile application license.
          </Text>

          {/* SECTION 10 */}
          <Text style={styles.sectionTitle}>10. SERVICES MANAGEMENT</Text>
          <Text style={styles.paragraph}>
            We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who violates the law or these Legal Terms; (3) refuse, restrict access to, limit the availability of, or disable any of your Contributions; (4) remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property.
          </Text>

          {/* SECTION 11 */}
          <Text style={styles.sectionTitle}>11. PRIVACY POLICY</Text>
          <Text style={styles.paragraph}>
            We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.
          </Text>

          {/* SECTION 12 */}
          <Text style={styles.sectionTitle}>12. COPYRIGHT INFRINGEMENTS</Text>
          <Text style={styles.paragraph}>
            We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a "Notification").
          </Text>

          {/* SECTION 13 */}
          <Text style={styles.sectionTitle}>13. TERM AND TERMINATION</Text>
          <Text style={styles.paragraph}>
            These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES, TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.
          </Text>
          <Text style={styles.paragraph}>
            If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party.
          </Text>

          {/* SECTION 14 */}
          <Text style={styles.sectionTitle}>14. MODIFICATIONS AND INTERRUPTIONS</Text>
          <Text style={styles.paragraph}>
            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We cannot guarantee the Services will be available at all times.
          </Text>

          {/* SECTION 15 */}
          <Text style={styles.sectionTitle}>15. GOVERNING LAW</Text>
          <Text style={styles.paragraph}>
            These Legal Terms shall be governed by and defined following the laws of India. Thoughts and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
          </Text>

          {/* SECTION 16 */}
          <Text style={styles.sectionTitle}>16. DISPUTE RESOLUTION</Text>
          <Text style={styles.subSectionTitle}>Informal Negotiations</Text>
          <Text style={styles.paragraph}>
            To expedite resolution and control the cost of any dispute, the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration.
          </Text>

          <Text style={styles.subSectionTitle}>Binding Arbitration</Text>
          <Text style={styles.paragraph}>
            Any dispute arising out of or in connection with these Legal Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber. The number of arbitrators shall be three (3). The seat of arbitration shall be Tuticorin, India. The language of the proceedings shall be English. The governing law shall be substantive law of India.
          </Text>

          <Text style={styles.subSectionTitle}>Restrictions</Text>
          <Text style={styles.paragraph}>
            The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.
          </Text>

          {/* SECTION 17 */}
          <Text style={styles.sectionTitle}>17. CORRECTIONS</Text>
          <Text style={styles.paragraph}>
            There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
          </Text>

          {/* SECTION 18 */}
          <Text style={styles.sectionTitle}>18. DISCLAIMER</Text>
          <Text style={styles.paragraph}>
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </Text>

          {/* SECTION 19 */}
          <Text style={styles.sectionTitle}>19. LIMITATIONS OF LIABILITY</Text>
          <Text style={styles.paragraph}>
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </Text>

          {/* SECTION 20 */}
          <Text style={styles.sectionTitle}>20. INDEMNIFICATION</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties; (5) your violation of the rights of a third party; or (6) any overt harmful act toward any other user of the Services.
          </Text>

          {/* SECTION 21 */}
          <Text style={styles.sectionTitle}>21. USER DATA</Text>
          <Text style={styles.paragraph}>
            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.
          </Text>

          {/* SECTION 22 */}
          <Text style={styles.sectionTitle}>22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Text>
          <Text style={styles.paragraph}>
            Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.
          </Text>

          {/* SECTION 23 */}
          <Text style={styles.sectionTitle}>23. CALIFORNIA USERS AND RESIDENTS</Text>
          <Text style={styles.paragraph}>
            If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
          </Text>

          {/* SECTION 24 */}
          <Text style={styles.sectionTitle}>24. MISCELLANEOUS</Text>
          <Text style={styles.paragraph}>
            These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law.
          </Text>

          {/* SECTION 25 */}
          <Text style={styles.sectionTitle}>25. CONTACT US</Text>
          <Text style={styles.paragraph}>
            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
          </Text>
          <Text style={styles.paragraph}>
            Thoughts{'\n'}
            26c/1a, Kamaraj Nagar, 3rd Mile{'\n'}
            Tuticorin, Tamil Nadu 628008{'\n'}
            India{'\n'}
            Phone: +91 63807 75 229{'\n'}
            thoughtsapp.support@gmail.com
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
