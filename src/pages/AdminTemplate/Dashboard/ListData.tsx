import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BookingItem } from "@/interface/booking.interface";
import type { ListUser } from "@/interface/user.interface";
import { formatDateSafe } from "@/hooks/useFormatDateSafe";

export type BookingWithUser = BookingItem & {
  user?: ListUser
}

type ListDataProps = {
  data: BookingWithUser[]
}

export function ListData({ data }: ListDataProps) {

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Lịch sử đặt phòng</h2>
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="border-b bg-muted/50">
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>SDT</TableHead>
              <TableHead>Mã phòng</TableHead>
              <TableHead>Ngày nhận phòng</TableHead>
              <TableHead>Ngày trả phòng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((person, index) => (
              <TableRow key={index} className="border-b hover:bg-accent/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={person.user?.avatar} alt={person.user?.name} />
                      <AvatarFallback className="bg-muted text-xs">
                        {person.user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.user?.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{person.user?.phone}</TableCell>
                <TableCell>{person.maPhong}</TableCell>
                <TableCell>{formatDateSafe(person.ngayDen)}</TableCell>
                <TableCell>{formatDateSafe(person.ngayDi)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
