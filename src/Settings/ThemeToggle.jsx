import { Modal, Radio, Group, Text, Button } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { useTranslation } from "../context/LanguageContext";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "../styles/ThemeToggle.module.css";
import { useLocation } from "react-router-dom";
import Settings from "../components/icons/settings";
import SettingsCategory from "./Category/SettingsCategory";
// import SettingsCategory from "../components/company/SettingsCategory";
import DarkIcon from "../components/icons/darkIcon";
import LightIcon from "../components/icons/lightIcon";

export function ThemeToggle() {
  const { t, lang, setLang } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [opened, setOpened] = useState(false);

  const location = useLocation();

  return (
    <>
      <div
        onClick={() => setOpened(true)}
        style={{ cursor: "pointer", margin: "0px 20px" }}
      >
        <Settings />
      </div>

      {/* Modal المحتوي على الراديو بوتونز */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t['Settings']}
        centered
        size="xl"
      >
        <Text style={{}} fw={600} mb="xs">
          {t.Themes}
        </Text>

        <Radio.Group value={colorScheme} orientation="vertical">
          <Group className={classes.Group} onClick={toggleColorScheme}>
            <div className={classes.Groupsvg}>
              <div className={classes.divsvg}>
                <LightIcon />
                <div className={classes.divRadio}>
                  <Radio
                    color="var(--color-1)"
                    value="light"
                    label={t['LightMode']}
                  />
                </div>
              </div>
            </div>

            <div className={classes.Groupsvg}>
              <div className={classes.divsvg}>
                <DarkIcon />
                <div className={classes.divRadio}>
                  <Radio
                    color="var(--color-1)"
                    value="dark"
                    label={t['DarkMode']}

                  />
                </div>
              </div>
            </div>
          </Group>
        </Radio.Group>
        <Text style={{}} fw={600} mb="xs">
          {t.Language}
        </Text>
        <Group mb="lg">
          <button
            style={{
              backgroundColor: lang !== "en" && "transparent",
              border: lang !== "en" && "1px solid  var(--color-border)",
              color: lang !== "en" && "var(--primary)",
            }}
            className={classes.languageButton}
            onClick={() => setLang("en")}
          >
            {t.English}
          </button>

          <button
            style={{
              backgroundColor: lang !== "ar" && "transparent",
              border: lang !== "ar" && "1px solid var(--color-border)",
              color: lang !== "ar" && "var(--primary)",
            }}
            className={classes.languageButton}
            onClick={() => setLang("ar")}
          >
            {t.Arabic}
          </button>
        </Group>
        {/* <Text
          style={{}}
          fw={600}
          mb="xs"

          // fz="lg"
          // className="var(--color-3)"
        >
          Categories 
        </Text>
        <SettingsCategory /> */}

      </Modal>
    </>
  );
}
