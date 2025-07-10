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
import { useTranslation } from '../context/LanguageContext';

const ContactUs = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={classes.dark}>
        <HeaderMegaMenu />

        <Container size="lg" py="xl">
          <Grid>
            {/* معلومات التواصل */}
            <Grid.Col span={6}>
              <h2 className={classes.textContact}>{t.ContactUs}</h2>
              <Title className={classes.GetContact}>{t.GetInTouchWithUs}</Title>
              <p className={classes.GetQuestions}>
                {t.HaveQuestionsOrNeedAssistanceOurTeamIsHereToHelp}
              </p>

              <Stack spacing="lg">
                <ContactInfo
                  icon={<IconMapPin size={20} />}
                  title={t.OurLocation}
                  description="Office 302, Olaya St, Riyadh 12211, Saudi Arabia"
                />
                <ContactInfo
                  icon={<IconPhone size={20} />}
                  title={t.PhoneNumber}
                  description="+966 11 234 5678"
                />
                <ContactInfo
                  icon={<IconMail size={20} />}
                  title={t.EmailAddress}
                  description="Company@gmail.com"
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper shadow="md" radius="md" p="lg" withBorder>
                <Stack>
                  <TextInput
                    p="xs"
                    label={t.Name}
                    placeholder={t.EnterYourName}
                    required
                  />
                  <TextInput
                    p="xs"
                    label={t.Email}
                    placeholder={t.EnterYourEmail}
                    type="email"
                    required
                  />
                  <TextInput
                    p="xs"
                    label={t.PhoneNumber}
                    placeholder={t.EnterYourPhoneNumber}
                    type="tel"
                    required
                  />
                  <Textarea
                    p="xs"
                    label={t.Message}
                    placeholder={t.EnterYourMessage}
                    minRows={4}
                    required
                  />
                  <Button
                    fullWidth
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'blue' }}
                  >
                    {t.SendMessage}
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </div>
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
