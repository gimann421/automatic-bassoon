import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';
import { ContentPanel, DiagramConfig, DiagramNode } from '../../../data/curriculum';

interface VisualDiagramProps {
  panel: ContentPanel;
  accentColor: string;
}

// ─── Cycle layout (e.g. Agile sprint loop) ─────────────────────────────────────

function CycleDiagram({ config, accentColor }: { config: DiagramConfig; accentColor: string }) {
  const { nodes } = config;
  return (
    <View style={cycleStyles.container}>
      <View style={cycleStyles.row}>
        {nodes.map((node, i) => (
          <View key={node.id} style={cycleStyles.nodeWrapper}>
            <View style={[cycleStyles.box, { borderColor: accentColor }]}>
              <Text style={[cycleStyles.label, { color: accentColor }]}>{node.label}</Text>
            </View>
            {i < nodes.length - 1 && (
              <View style={cycleStyles.arrowRight}>
                <Text style={[cycleStyles.arrowText, { color: accentColor }]}>→</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      {/* Loop back arrow */}
      <View style={cycleStyles.loopRow}>
        <Text style={[cycleStyles.loopArrow, { color: accentColor }]}>↩ repeat</Text>
      </View>
    </View>
  );
}

const cycleStyles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  nodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  box: {
    borderWidth: 2,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceElevated,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  arrowRight: {
    alignItems: 'center',
  },
  arrowText: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  loopRow: {
    alignItems: 'flex-end',
    paddingRight: Spacing.md,
  },
  loopArrow: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

// ─── Two-column layout (e.g. Frontend vs Backend) ──────────────────────────────

function TwoColumnDiagram({ config, accentColor }: { config: DiagramConfig; accentColor: string }) {
  const [left, right] = config.nodes;
  const connection = config.connections[0];
  return (
    <View style={twoColStyles.container}>
      <View style={twoColStyles.box}>
        <Text style={[twoColStyles.boxTitle, { color: accentColor }]}>{left.label}</Text>
        {left.sublabel && (
          <Text style={twoColStyles.boxSub}>{left.sublabel}</Text>
        )}
      </View>

      <View style={twoColStyles.arrowCol}>
        <Text style={[twoColStyles.arrowLine, { color: Colors.textMuted }]}>⟵</Text>
        {connection.label && (
          <Text style={twoColStyles.arrowLabel}>{connection.label}</Text>
        )}
        <Text style={[twoColStyles.arrowLine, { color: Colors.textMuted }]}>⟶</Text>
      </View>

      <View style={twoColStyles.box}>
        <Text style={[twoColStyles.boxTitle, { color: accentColor }]}>{right.label}</Text>
        {right.sublabel && (
          <Text style={twoColStyles.boxSub}>{right.sublabel}</Text>
        )}
      </View>
    </View>
  );
}

const twoColStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  box: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    gap: 4,
  },
  boxTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    textAlign: 'center',
  },
  boxSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  arrowCol: {
    alignItems: 'center',
    gap: 2,
    width: 48,
  },
  arrowLine: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  arrowLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});

// ─── Two-table layout (e.g. Users ↔ Orders foreign key) ────────────────────────

function TwoTableDiagram({ config, accentColor }: { config: DiagramConfig; accentColor: string }) {
  const connection = config.connections[0];
  const fromNode = config.nodes.find((n) => n.id === connection.from);
  const toNode = config.nodes.find((n) => n.id === connection.to);

  return (
    <View style={tableStyles.container}>
      {config.nodes.map((node, i) => (
        <View key={node.id} style={tableStyles.tableWrapper}>
          <TableBox node={node} accentColor={accentColor} isFrom={node.id === fromNode?.id} />
          {i < config.nodes.length - 1 && (
            <View style={tableStyles.connectorRow}>
              <Text style={[tableStyles.connectorArrow, { color: accentColor }]}>→</Text>
              {connection.label && (
                <Text style={tableStyles.connectorLabel}>{connection.label}</Text>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function TableBox({ node, accentColor, isFrom }: { node: DiagramNode; accentColor: string; isFrom: boolean }) {
  return (
    <View style={tableBoxStyles.table}>
      <View style={[tableBoxStyles.header, { backgroundColor: accentColor }]}>
        <Text style={tableBoxStyles.headerText}>{node.label}</Text>
      </View>
      {(node.tableColumns ?? []).map((col, i) => (
        <View
          key={col}
          style={[
            tableBoxStyles.row,
            i < (node.tableColumns?.length ?? 0) - 1 && tableBoxStyles.rowBorder,
            isFrom && col === node.tableColumns?.[1] && tableBoxStyles.highlightRow,
          ]}
        >
          <Text style={tableBoxStyles.colText}>{col}</Text>
        </View>
      ))}
    </View>
  );
}

const tableStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tableWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorRow: {
    alignItems: 'center',
    width: 36,
    gap: 2,
  },
  connectorArrow: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  connectorLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});

const tableBoxStyles = StyleSheet.create({
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  headerText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.white,
  },
  row: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  highlightRow: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  colText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace' as any,
  },
});

// ─── Main VisualDiagram component ───────────────────────────────────────────────

export default function VisualDiagram({ panel, accentColor }: VisualDiagramProps) {
  const config = panel.diagramConfig;
  if (!config) return null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.diagramIcon}>📊</Text>
        <Text style={[styles.label, { color: accentColor }]}>DIAGRAM</Text>
      </View>
      <View style={styles.diagramArea}>
        {config.layout === 'cycle' && (
          <CycleDiagram config={config} accentColor={accentColor} />
        )}
        {config.layout === 'two-column' && (
          <TwoColumnDiagram config={config} accentColor={accentColor} />
        )}
        {config.layout === 'two-table' && (
          <TwoTableDiagram config={config} accentColor={accentColor} />
        )}
      </View>
      <Text style={styles.caption}>{panel.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  diagramIcon: {
    fontSize: FontSize.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  diagramArea: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.lg,
  },
  caption: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
