import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "../../context/LanguageContext";
import classes from "../../styles/ThemeToggle.module.css";

export function HomeThemeToggle() {
    const { t, lang, setLang } = useTranslation();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const [opened, setOpened] = useState(false);

    return (
        <>
            <div className={classes.wrapper}>
                {/* Dark Mode Switch Button */}
                <Tooltip label={dark ? t["LightMode"] : t["DarkMode"]} withArrow>
                    <ActionIcon
                        onClick={toggleColorScheme}
                        variant="default"
                        // size="lg"
                        radius="md"
                        className={classes.iconButton1}
                    >
                        {dark ? (
                            <IconSun size={18} color="#facc15" />
                        ) : (
                            <IconMoonStars size={18} color="#272727" />
                        )}
                    </ActionIcon>
                </Tooltip>

                {/* Language Switch Button */}
                <div
                    className={classes.iconButton}
                    onClick={() => setLang(lang === "en" ? "ar" : "en")}
                >
                    🌐 <span style={{ marginLeft: 4 }}>{lang.toUpperCase()}</span>
                </div>
            </div>
        </>
    );
}
