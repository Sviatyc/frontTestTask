import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getDatabase, ref, get, remove } from "firebase/database";
import { app } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import Map from "./Map";
import { ModeToggle } from "@/components/mode-toggle";

export default function DataTable() {
  const [markers, setMarkers] = useState([]);

  const fetchMarkers = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "markers");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const markerList = Object.values(snapshot.val()).map((marker) => ({
        ...marker,
        date: new Date(marker.date).toLocaleString(),
      }));
      setMarkers(markerList);
    } else {
      console.log("No markers found in database");
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  const clearAllMarkers = async () => {
    const db = getDatabase(app);
    const markersRef = ref(db, "markers");
    await remove(markersRef);
    setMarkers([]);
  };

  return (
    <div>
      <Map updateMarkers={fetchMarkers} />
      <ModeToggle />
      <div className="flex justify-center mt-4 h-96">
        <Table className="w-1/2 m-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Markers</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markers.map((item, index) => (
              <TableRow key={index}>
                <TableHead>{index + 1}</TableHead>
                <TableHead>{item.lat}</TableHead>
                <TableHead>{item.lng}</TableHead>
                <TableHead>{item.date}</TableHead>
                <Button onClick={() => clearMarker(index)}>Clear</Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={clearAllMarkers}>Clear All</Button>
      </div>
    </div>
  );
}
