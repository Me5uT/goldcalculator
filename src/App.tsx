import { Form, InputNumber, Typography, Row, Col, Card, Divider } from "antd";
import "./App.css";
import { useFetchData } from "./components/fetchdata";
import { useEffect, useMemo, useState } from "react";

const { Title } = Typography;

export type DataItem = {
  Buying: number;
  Change: number;
  Name: string;
  Selling: number;
  Type: string;
};

const LOCAL_KEY = "gold-form-data";

// TL formatı
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })
    .format(value)
    .replace("₺", "")
    .trim();
};

const App = () => {
  const { productList } = useFetchData();
  const [form] = Form.useForm();
  const [individualTotals, setIndividualTotals] = useState<
    Record<string, number>
  >({});
  const [total, setTotal] = useState(0);

  const goldItems = useMemo(() => {
    if (!productList) return {};
    return Object.fromEntries(
      Object.entries(productList).filter(([_, value]) => value.Type === "Gold")
    );
  }, [productList]);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.setFieldsValue(parsed.values);
      calculateTotals(parsed.values);
    }
  }, [form, goldItems]);

  const calculateTotals = (values: Record<string, number>) => {
    let newIndividualTotals: Record<string, number> = {};
    let generalTotal = 0;

    for (const [key, item] of Object.entries(goldItems)) {
      const quantity = values[key] || 0;
      const itemTotal = quantity * item.Selling;
      newIndividualTotals[key] = Number(itemTotal.toFixed(2));
      generalTotal += itemTotal;
    }

    setIndividualTotals(newIndividualTotals);
    setTotal(Number(generalTotal.toFixed(2)));
  };

  const handleValuesChange = (_: any, allValues: Record<string, number>) => {
    calculateTotals(allValues);
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ values: allValues }));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      {/* SOL: Form */}
      <div style={{ width: "60%", paddingRight: 24 }}>
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          {Object.entries(goldItems).map(([key, item]) => (
            <Form.Item key={key} label={item.Name}>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Form.Item name={key} noStyle>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="Miktar girin"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <span>
                    {individualTotals[key]
                      ? `${formatCurrency(individualTotals[key])}`
                      : "0 ₺"}{" "}
                    ({formatCurrency(item.Selling)} ₺/birim)
                  </span>
                </Col>
              </Row>
            </Form.Item>
          ))}
        </Form>
      </div>

      {/* SAĞ: Özet */}
      <div style={{ width: "40%" }}>
        <Card title="Özet" bordered>
          {Object.entries(individualTotals).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>{goldItems[key]?.Name}</span>
              <span>{formatCurrency(value)}</span>
            </div>
          ))}
          <Divider />
          <Title level={4} style={{ textAlign: "right" }}>
            Genel Toplam: {formatCurrency(total)}
          </Title>
        </Card>
      </div>
    </div>
  );
};

export default App;
