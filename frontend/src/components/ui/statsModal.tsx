import React from "react";
import { Modal, Table } from "@mantine/core";
import dayjs from "dayjs";
import { rowsToCsv, saveCsvWithDialog, capitaliseFirst} from "../helpers";

type StatRow = {
  Datum: string;
  Jahr: number;
  Monat: number;
  Dimension: string;
  Kategorie: string;
  Anzahl: number;
  N: number;
};

export function StatsModal({
  opened,
  onClose,
  rows,
}: {
  opened: boolean;
  onClose: () => void;
  rows: StatRow[];
}) {
    const handleDownloadCsv = async() => {
    if (!rows.length) return;

    const csv = rowsToCsv(rows);
    const firstDate = rows[0]?.Datum ?? dayjs().format("YYYY-MM-DD");
    // downloadCsv(`stats_${firstDate}.csv`, csv);
    await saveCsvWithDialog(`BuT_Statistik_${firstDate}.csv`, csv);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Statistik"
      size="lg"
      centered
    >
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="text-sm text-gray-600">
          {rows.length} Zeilen
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="shrink-0 text-xs px-2 py-0.5 rounded-md leading-none"
        >
          CSV herunterladen
        </button>
      </div>

      <div className="max-h-[60vh] overflow-auto border rounded-md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Datum</Table.Th>
              <Table.Th>Dimension</Table.Th>
              <Table.Th>Kategorie</Table.Th>
              <Table.Th>Anzahl</Table.Th>
              <Table.Th>N</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows.map((row, i) => (
              <Table.Tr key={`${row.Dimension}-${row.Kategorie}-${i}`}>
                <Table.Td>{row.Datum}</Table.Td>
                <Table.Td>{capitaliseFirst(row.Dimension)}</Table.Td>
                <Table.Td>{capitaliseFirst(row.Kategorie)}</Table.Td>
                <Table.Td>{row.Anzahl}</Table.Td>
                <Table.Td>{row.N}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Modal>
  );
}
