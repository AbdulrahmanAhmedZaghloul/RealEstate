import React from 'react';
import {
  Container,
  Grid,
  TextInput,
  Textarea,
  Button,
  Title,
  Text,
  Group,
  Box,
  Paper,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import {
  IconMapPin,
  IconPhone,
  IconMail,
} from '@tabler/icons-react';
import { HeaderMegaMenu } from '../components/company/HeaderMegaMenu';
import classes from '../styles/ContactUs.module.css';

const ContactUs = () => {
  return (
    <>

      <HeaderMegaMenu></HeaderMegaMenu>
      <body
        style={{
          backgroundColor: " var(--color-11)"
        }}>

        <Container size="lg" py="xl" >

          <Grid>
            {/* معلومات التواصل */}
            <Grid.Col span={6}>
              <h2 className={classes.textContact}>Contact Us</h2>
              <Title className={classes.GetContact}>Get In Touch With Us</Title>
              <p className={classes.GetQuestions}>
                Have questions or need assistance? Our team is here to help.
                Fill out the form below or contact us directly — we'll get back to you as soon as possible.
              </p>

              <Stack spacing="lg">
                <ContactInfo
                  icon={<IconMapPin size={20} />}
                  title="Our Location"
                  description="Office 302, Olaya St, Riyadh 12211, Saudi Arabia"
                />
                <ContactInfo
                  icon={<IconPhone size={20} />}
                  title="Phone Number"
                  description="+966 11 234 5678"
                />
                <ContactInfo
                  icon={<IconMail size={20} />}
                  title="Email Address"
                  description="Company@gmail.com"
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>

              <Paper shadow="md" radius="md" p="lg" withBorder>
                <Stack>
                  <TextInput p="xs" label="Name" placeholder="Enter your name" required />
                  <TextInput p="xs" label="Email" placeholder="Enter your email" type="email" required />
                  <TextInput p="xs" label="Phone number" placeholder="Enter your number" type="tel" required />
                  <Textarea p="xs" label="Message" placeholder="Enter your message" minRows={4} required />
                  <Button fullWidth variant="gradient" gradient={{ from: 'indigo', to: 'blue' }}>
                    Send Message
                  </Button>
                </Stack>
              </Paper>

            </Grid.Col>
          </Grid>

        </Container>

      </body>

    </>

  );
};

// مكون فرعي لعرض المعلومات
const ContactInfo = ({ icon, title, description }) => (
  <Group align="flex-start" spacing="md" className={classes.StackQuestions}>
    <ThemeIcon className={classes.backQuestions} size="xl" >
      {icon}
    </ThemeIcon>
    <Box>
      <Text fw={500}>{title}</Text>
      <Text size="sm" color="dimmed">{description}</Text>
    </Box>
  </Group>
);

export default ContactUs;
