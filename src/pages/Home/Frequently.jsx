import React from 'react';
import { Accordion, Container, Title, Text } from '@mantine/core';

function Frequently() {
  return (
    <>

      <Container size="sm" py="xl">
        <Title order={2} align="center" mb="md">
          Frequently asked questions
        </Title>
        <Text align="center" color="dimmed" mb="xl">
          Everything you need to know about the product and billing.
        </Text>

        <Accordion radius="md" defaultValue="q1">


          <Accordion.Item value="q1" style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }}  >
            <Accordion.Control>Can I use Spline for free?</Accordion.Control>
            <Accordion.Panel>
              Yes, totally! The Basic plan is free. You can have unlimited personal files and file
              viewers. Maximum 1 team project can be created with 2 team files and 2 editors. You also
              have access to the Spline Library and can publish your scenes with a Spline logo.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q2" style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }} >
            <Accordion.Control>What's the difference between a marketer and company?</Accordion.Control>
            <Accordion.Panel>
              A marketer is an individual who uses the platform for their own campaigns, while a company account is intended for collaborative team usage.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item  value="q3" style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }}  >
            <Accordion.Control>What payment methods can I use?</Accordion.Control>
            <Accordion.Panel>
              You can use major credit cards such as Visa, MasterCard, American Express, and more.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item  value="q4" style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }} >
            <Accordion.Control>How does team billing work?</Accordion.Control>
            <Accordion.Panel>
              Team billing allows all users under a workspace to be billed together in a single invoice.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item  value="q5"  style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }} >
            <Accordion.Control>How can I cancel my subscription?</Accordion.Control>
            <Accordion.Panel>
              You can cancel your subscription anytime from your account settings under the billing tab.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item  value="q6" style={{
            marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }} >
            <Accordion.Control>Can I change from monthly to yearly?</Accordion.Control>
            <Accordion.Panel>
              Yes, you can switch your billing cycle from monthly to yearly at any time from your account.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="q7" style={{
            // marginBottom: "20px",
          backgroundColor: "var(--color-5)"
          }} >
            <Accordion.Control>How can I ask other questions about pricing?</Accordion.Control>
            <Accordion.Panel>
              You can reach out to our support team via the contact form on our pricing page.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>



    </>

  );
}

export default Frequently;
