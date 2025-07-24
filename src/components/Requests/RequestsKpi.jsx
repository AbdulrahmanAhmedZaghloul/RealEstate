


// src/components/Requests/RequestsKpi.jsx
import React from "react";
import { Card, Text, Box, Grid } from "@mantine/core";
import { useTranslation } from "../../context/LanguageContext";

export default function RequestsKpi({ kpiData }) {
      const { t } = useTranslation();

      const {
            total_requests = 0,
            matched = 0,
            pending = 0,
            match_rate = 0,
      } = kpiData || {};

      return (
            <Box mb="lg">
                  <Grid gutter="md">
                        {/* Total Requests */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          {t.TotalRequests}
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          {total_requests}
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Matched */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          {t.Matched}
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          {matched}
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Pending */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          {t.Pending}
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          {pending}
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Match Rate */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          {t.MatchRate}
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          {match_rate}%
                                    </Text>
                              </Card>
                        </Grid.Col>
                  </Grid>
            </Box>
      );
}

 