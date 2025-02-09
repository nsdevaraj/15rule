import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    width: '60%',
    fontSize: 12,
  },
  value: {
    width: '40%',
    fontSize: 12,
    textAlign: 'right',
  },
});

interface PdfDocumentProps {
  monthlyInvestment: number;
  duration: number;
  returnRate: number;
  investedAmount: number;
  totalWealth: number;
  totalEarnings: number;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString()}`;
};

export const PdfDocument = ({
  monthlyInvestment,
  duration,
  returnRate,
  investedAmount,
  totalWealth,
  totalEarnings,
}: PdfDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Investment Calculator Report</Text>
      
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Input Parameters</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly Investment</Text>
          <Text style={styles.value}>{formatCurrency(monthlyInvestment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{duration} years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Return Rate</Text>
          <Text style={styles.value}>{returnRate}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Results</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Investment</Text>
          <Text style={styles.value}>{formatCurrency(investedAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Wealth</Text>
          <Text style={styles.value}>{formatCurrency(totalWealth)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Earnings</Text>
          <Text style={styles.value}>{formatCurrency(totalEarnings)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
