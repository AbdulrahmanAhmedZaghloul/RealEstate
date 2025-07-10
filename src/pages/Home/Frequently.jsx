import React from 'react';
import { Accordion, Container, Title, Text } from '@mantine/core';
import { useTranslation } from '../../context/LanguageContext';

function Frequently() {
  const { t } = useTranslation();
  return (
    <>
      <Container size="sm" py="xl">
        <Title order={2} align="center" mb="md">
          {t.FrequentlyAskedQuestions}
        </Title>
        <Text align="center" color="dimmed" mb="xl">
          {t.EverythingYouNeedToKnowAboutTheProductAndBilling}
        </Text>

        <Accordion radius="md" defaultValue="q1">

          <Accordion.Item value="q1" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.CanIUseSplineForFree}</Accordion.Control>
            <Accordion.Panel>{t.YesTotallyTheBasicPlanIsFree}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q2" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.WhatIsTheDifferenceBetweenAMarketerAndCompany}</Accordion.Control>
            <Accordion.Panel>{t.AMarketerIsAnIndividualWhoUsesThePlatform}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q3" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.WhatPaymentMethodsCanIUse}</Accordion.Control>
            <Accordion.Panel>{t.YouCanUseMajorCreditCardsSuchAsVisa}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q4" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.HowDoesTeamBillingWork}</Accordion.Control>
            <Accordion.Panel>{t.TeamBillingAllowsAllUsersUnderAWorkspace}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q5" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.HowCanICancelMySubscription}</Accordion.Control>
            <Accordion.Panel>{t.YouCanCancelYourSubscriptionAnytimeFromYourAccountSettings}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q6" style={{ marginBottom: "20px", backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.CanIChangeFromMonthlyToYearly}</Accordion.Control>
            <Accordion.Panel>{t.YouCanSwitchYourBillingCycleFromMonthlyToYearly}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q7" style={{ backgroundColor: "var(--color-5)" }}>
            <Accordion.Control>{t.HowCanIAskOtherQuestionsAboutPricing}</Accordion.Control>
            <Accordion.Panel>{t.YouCanReachOutToOurSupportTeamViaTheContactForm}</Accordion.Panel>
          </Accordion.Item>

        </Accordion>
      </Container>
    </>

  );
}

export default Frequently;
