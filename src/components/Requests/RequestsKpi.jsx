import React, { useState } from "react";
import {
      Card,
      Table,
      Text,
      Group,
      ActionIcon,
      Button,
      TextInput,
      Box,
      Select,
      Grid,
      GridCol,
} from "@mantine/core";
import { useRequestsKPIs } from "../../hooks/queries/Requests/useRequestsKPIs";
import { useTranslation } from "../../context/LanguageContext";

export default function RequestsKpi() {
      const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

      const { data: RequestsKpi } = useRequestsKPIs();
      console.log(RequestsKpi);

      // const [data, setData] = useState({});

      return (
            <Box mb="lg">
                  <Grid gutter="md">
                        {/* Total  */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          {t.TotalRequests}
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          1,240
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Matched */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          Matched
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          1,000
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Pending */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          Pending
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          240
                                    </Text>
                              </Card>
                        </Grid.Col>

                        {/* Match Rate */}
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                              <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Text size="lg" fw={500}>
                                          Match Rate
                                    </Text>
                                    <Text size="xl" fw={700}>
                                          40%
                                    </Text>
                              </Card>
                        </Grid.Col>
                  </Grid>
            </Box>
      )
}
