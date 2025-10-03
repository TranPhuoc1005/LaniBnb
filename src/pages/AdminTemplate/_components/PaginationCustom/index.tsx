import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationCustomProps = {
    setPagi: (numPagi: number) => void;
    pageIndex?: number;
    pageSize?: number;
    totalRow?: number;
};

export default function PaginationCustom({ setPagi, pageIndex, pageSize, totalRow }: PaginationCustomProps) {
    const prevPagi = (pageIndex ?? 0) - 1;
    const nextPagi = (pageIndex ?? 0) + 1;
    const totalPagi = (totalRow && pageSize) ? Math.ceil(totalRow / pageSize) : 0;

    return (
        <Pagination>
            <PaginationContent>
                {pageIndex !== 1 && <PaginationItem onClick={() => setPagi(prevPagi)}>
                    <PaginationPrevious />
                </PaginationItem>}
                <PaginationItem >
                    <PaginationLink isActive className="pointer-events-none">{pageIndex}</PaginationLink>
                </PaginationItem>
                {
                    (nextPagi < totalPagi) &&
                    <>
                        <PaginationItem onClick={() => setPagi(nextPagi)}>
                            <PaginationLink>{nextPagi}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                }

                {pageIndex !== totalPagi &&
                    <>
                        <PaginationItem onClick={() => setPagi(totalPagi)}>
                            <PaginationLink>{totalPagi}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem onClick={() => setPagi(nextPagi)}>
                            <PaginationNext />
                        </PaginationItem>
                    </>
                }
            </PaginationContent>
        </Pagination>
    )
}
