import {useCallback, useEffect, useMemo, useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import type {UserSummaryDto} from "../api/dtos/user.ts";
import {deletePendingUser, getUsers, updateUserStatus} from "../api/services/user-services.ts";
import type {AppOutletContext} from "../components/app/AppShell.tsx";
import {
    EmptyState,
    LoadingBlock,
    PageHeader,
    SectionCard,
    StatusBadge,
    dangerButtonClassName,
    inputClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
    tableCellClassName,
    tableClassName,
    tableContainerClassName,
    tableHeadCellClassName
} from "../components/app/WorkspaceUi.tsx";
import {formatEnumLabel} from "../utils/display.ts";

type SortKey = "name" | "email" | "role" | "status";
const accountStatusOptions: readonly UserSummaryDto["accountStatus"][] = ["PENDING", "APPROVED", "REJECTED"];

export default function UsersPage() {
    const {role} = useOutletContext<AppOutletContext>();
    const [users, setUsers] = useState<UserSummaryDto[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortAscending, setSortAscending] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingStatus, setEditingStatus] = useState<UserSummaryDto["accountStatus"]>("PENDING");
    const [error, setError] = useState("");

    const isAdmin = role === "ADMIN";

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            setUsers(await getUsers());
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const matchingUsers = users.filter((user) => {
            if (!query) {
                return true;
            }

            return [user.fullName, user.email, user.role, user.accountStatus]
                .some((value) => value.toLowerCase().includes(query));
        });

        const sortedUsers = [...matchingUsers].sort((left, right) => {
            const factor = sortAscending ? 1 : -1;
            switch (sortKey) {
                case "name":
                    return left.fullName.localeCompare(right.fullName) * factor;
                case "email":
                    return left.email.localeCompare(right.email) * factor;
                case "role":
                    return left.role.localeCompare(right.role) * factor;
                case "status":
                    return left.accountStatus.localeCompare(right.accountStatus) * factor;
                default:
                    return 0;
            }
        });

        return sortedUsers;
    }, [searchQuery, sortAscending, sortKey, users]);

    const beginEditStatus = (user: UserSummaryDto) => {
        setEditingUserId(user.userId);
        setEditingStatus(user.accountStatus);
    };

    const cancelEditStatus = () => {
        setEditingUserId(null);
        setEditingStatus("PENDING");
    };

    const handleUpdateStatus = async (userId: number) => {
        try {
            setActiveUserId(userId);
            setError("");
            await updateUserStatus(userId, editingStatus);

            cancelEditStatus();
            await loadUsers();
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : "Failed to update user status");
        } finally {
            setActiveUserId(null);
        }
    };

    const handleDeleteUser = async (userId: number, fullName: string) => {
        const confirmed = window.confirm(`Delete ${fullName}? This cannot be undone.`);
        if (!confirmed) {
            return;
        }

        try {
            setActiveUserId(userId);
            setError("");
            await deletePendingUser(userId);
            await loadUsers();
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user");
        } finally {
            setActiveUserId(null);
        }
    };

    return (
        <section className="space-y-6">
            <PageHeader
                description="Platform login accounts are managed here. Admins can view linked person details, change account status, and delete accounts from one dedicated page."
                eyebrow="Platform users"
                title="Users"
            />

            <SectionCard description="Search, sort, and manage every platform login account." title="User filters">
                <div className="grid gap-4 md:grid-cols-3">
                    <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                        Search
                        <input
                            className={inputClassName}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by name, email, role, or status"
                            value={searchQuery}
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Sort by
                        <select className={inputClassName} onChange={(event) => setSortKey(event.target.value as SortKey)} value={sortKey}>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="role">Role</option>
                            <option value="status">Status</option>
                        </select>
                    </label>
                </div>
                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input
                        checked={sortAscending}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        onChange={(event) => setSortAscending(event.target.checked)}
                        type="checkbox"
                    />
                    Ascending order
                </label>
            </SectionCard>

            {error ? <EmptyState description={error} title="Unable to load users" /> : null}
            {isLoading ? <LoadingBlock label="Loading users" /> : null}

            {!isLoading && !error ? (
                filteredUsers.length === 0 ? (
                    <EmptyState description="No platform users matched the current filters." title="No users found" />
                ) : (
                    <SectionCard description="Only admins can manage these accounts." title="Platform user directory">
                        <div className={tableContainerClassName}>
                            <table className={tableClassName}>
                                <thead>
                                    <tr>
                                        <th className={tableHeadCellClassName}>Name</th>
                                        <th className={tableHeadCellClassName}>Email</th>
                                        <th className={tableHeadCellClassName}>Role</th>
                                        <th className={tableHeadCellClassName}>Status</th>
                                        <th className={tableHeadCellClassName}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.userId}>
                                            <td className={tableCellClassName}>{user.fullName}</td>
                                            <td className={tableCellClassName}>{user.email}</td>
                                            <td className={tableCellClassName}>{formatEnumLabel(user.role)}</td>
                                            <td className={tableCellClassName}>
                                                {editingUserId === user.userId ? (
                                                    <select className={inputClassName} onChange={(event) => setEditingStatus(event.target.value as UserSummaryDto["accountStatus"])} value={editingStatus}>
                                                        {accountStatusOptions.map((statusOption) => (
                                                            <option key={statusOption} value={statusOption}>{formatEnumLabel(statusOption)}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <StatusBadge
                                                        label={formatEnumLabel(user.accountStatus)}
                                                        tone={user.accountStatus === "APPROVED" ? "emerald" : user.accountStatus === "REJECTED" ? "rose" : "amber"}
                                                    />
                                                )}
                                            </td>
                                            <td className={tableCellClassName}>
                                                {isAdmin ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link className={secondaryButtonClassName} to={`/app/people/${user.userId}`}>
                                                            View
                                                        </Link>
                                                        <Link className={primaryButtonClassName} to={`/app/people/${user.userId}/edit`}>
                                                            Edit
                                                        </Link>
                                                        {editingUserId === user.userId ? (
                                                            <>
                                                                <button
                                                                    className={secondaryButtonClassName}
                                                                    disabled={activeUserId === user.userId}
                                                                    onClick={() => void handleUpdateStatus(user.userId)}
                                                                    type="button"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className={dangerButtonClassName}
                                                                    disabled={activeUserId === user.userId}
                                                                    onClick={cancelEditStatus}
                                                                    type="button"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className={secondaryButtonClassName}
                                                                disabled={activeUserId === user.userId}
                                                                onClick={() => beginEditStatus(user)}
                                                                type="button"
                                                            >
                                                                Change status
                                                            </button>
                                                        )}
                                                        <button
                                                            className={dangerButtonClassName}
                                                            disabled={activeUserId === user.userId}
                                                            onClick={() => void handleDeleteUser(user.userId, user.fullName)}
                                                            type="button"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500">Admin only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SectionCard>
                )
            ) : null}
        </section>
    );
}