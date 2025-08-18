import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const CustomTable = ({
    data = [],
    columns = [],
    onEdit,
    onDelete,
    onView,
    loading = false,
    emptyMessage = "No data found",
    isDarkMode = false,
    theme,
    showActions = true,
    actionColumnTitle = "Actions",
    editPermission = true,
    deletePermission = true,
    viewPermission = false,
    // Pagination props
    pagination = null,
    onPageChange,
    onPerPageChange
}) => {
    // Safe theme access
    const t = isDarkMode && theme?.dark ? theme.dark : theme?.light || {
        text: '#1e293b',
        bg: '#f8fafc',
        cardBg: '#ffffff',
        border: '#e2e8f0',
        textSec: '#64748b',
        primary: '#3b82f6',
        danger: '#ef4444',
        success: '#10b981'
    };

    // Handle delete with confirmation
    const handleDelete = (item) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDelete(item);
        }
    };

    // Render cell content based on column type
    const renderCellContent = (item, column) => {
        const value = column.key.split('.').reduce((obj, key) => obj?.[key], item);

        switch (column.type) {
            case 'badge':
                return (
                    <span style={{
                        background: column.badgeColor || (isDarkMode ? '#374151' : '#f3f4f6'),
                        color: column.textColor || (isDarkMode ? '#d1d5db' : '#374151'),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                    }}>
                        {value || 0} {column.suffix || ''}
                    </span>
                );

            case 'status':
                const statusColors = {
                    active: { bg: '#dcfce7', color: '#166534' },
                    inactive: { bg: '#fee2e2', color: '#dc2626' },
                    pending: { bg: '#fef3c7', color: '#d97706' }
                };
                const statusStyle = statusColors[value?.toLowerCase()] || statusColors.inactive;

                return (
                    <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                    }}>
                        {value || 'Unknown'}
                    </span>
                );

            case 'currency':
                const numericValue = parseFloat(value) || 0;
                return (
                    <span style={{ color: t.primary, fontWeight: '600' }}>
                        {column.currencySymbol || '$'}{numericValue.toLocaleString()}
                    </span>
                );

            case 'date':
                return (
                    <span style={{ color: t.textSec }}>
                        {value ? new Date(value).toLocaleDateString() : '-'}
                    </span>
                );

            case 'image':
                return value ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <img
                            src={value}
                            alt="Product"
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: `2px solid ${t.border}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onError={(e) => {
                                // Handle broken images
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            background: isDarkMode ? '#374151' : '#f3f4f6',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: t.textSec,
                            fontSize: '0.75rem',
                            border: `2px solid ${t.border}`
                        }}>
                            No Image
                        </div>
                    </div>
                ) : (
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        background: isDarkMode ? '#374151' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: t.textSec,
                        fontSize: '0.75rem',
                        border: `2px solid ${t.border}`,
                        margin: '0 auto'
                    }}>
                        No Image
                    </div>
                );

            default:
                // Handle custom render function
                if (column.render && typeof column.render === 'function') {
                    return (
                        <span style={{
                            color: column.primary ? t.text : t.textSec,
                            fontWeight: column.primary ? '500' : 'normal'
                        }}>
                            {column.render(value)}
                        </span>
                    );
                }

                return (
                    <span style={{
                        color: column.primary ? t.text : t.textSec,
                        fontWeight: column.primary ? '500' : 'normal'
                    }}>
                        {value || column.defaultValue || '-'}
                    </span>
                );
        }
    };

    // Pagination component
    const renderPagination = () => {
        if (!pagination || !onPageChange) return null;

        const { current_page, last_page, per_page, total, from, to } = pagination;

        // Generate page numbers to show
        const getPageNumbers = () => {
            const delta = 2;
            const range = [];
            const rangeWithDots = [];

            for (let i = Math.max(2, current_page - delta);
                 i <= Math.min(last_page - 1, current_page + delta);
                 i++) {
                range.push(i);
            }

            if (current_page - delta > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }

            rangeWithDots.push(...range);

            if (current_page + delta < last_page - 1) {
                rangeWithDots.push('...', last_page);
            } else if (last_page > 1) {
                rangeWithDots.push(last_page);
            }

            return rangeWithDots;
        };

        const pageNumbers = getPageNumbers();

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderTop: `1px solid ${t.border}`,
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                {/* Showing entries info */}
                <div style={{
                    color: t.textSec,
                    fontSize: '0.875rem'
                }}>
                    Showing {from} to {to} of {total} entries
                </div>

                {/* Per page selector */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        color: t.textSec,
                        fontSize: '0.875rem'
                    }}>
                        Show:
                    </span>
                    <select
                        value={per_page}
                        onChange={(e) => onPerPageChange && onPerPageChange(parseInt(e.target.value))}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: `1px solid ${t.border}`,
                            borderRadius: '4px',
                            background: t.cardBg,
                            color: t.text,
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* Pagination buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    {/* Previous button */}
                    <button
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page <= 1}
                        style={{
                            padding: '0.5rem 0.75rem',
                            border: `1px solid ${t.border}`,
                            borderRadius: '6px',
                            background: current_page <= 1 ? t.bg : t.cardBg,
                            color: current_page <= 1 ? t.textSec : t.text,
                            cursor: current_page <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Previous
                    </button>

                    {/* Page numbers */}
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <span key={index} style={{
                                padding: '0.5rem',
                                color: t.textSec
                            }}>
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: `1px solid ${t.border}`,
                                    borderRadius: '6px',
                                    background: current_page === page ? t.primary : t.cardBg,
                                    color: current_page === page ? 'white' : t.text,
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    minWidth: '40px'
                                }}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    {/* Next button */}
                    <button
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page >= last_page}
                        style={{
                            padding: '0.5rem 0.75rem',
                            border: `1px solid ${t.border}`,
                            borderRadius: '6px',
                            background: current_page >= last_page ? t.bg : t.cardBg,
                            color: current_page >= last_page ? t.textSec : t.text,
                            cursor: current_page >= last_page ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{
                background: t.cardBg,
                borderRadius: '12px',
                border: `1px solid ${t.border}`,
                padding: '3rem',
                textAlign: 'center',
                color: t.textSec
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: `2px solid ${t.border}`,
                        borderTop: `2px solid ${t.primary}`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    Loading...
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                background: t.cardBg,
                borderRadius: '12px',
                border: `1px solid ${t.border}`,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Table View */}
                <div style={{
                    overflowX: 'auto'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: 'fit-content',
                        tableLayout: 'auto'
                    }}>
                        <thead>
                            <tr style={{ background: t.bg }}>
                                {columns.map((column, index) => (
                                    <th key={index} style={{
                                        padding: '1rem',
                                        textAlign: column.align || 'left',
                                        color: t.text,
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        whiteSpace: 'nowrap',
                                        width: column.width || 'auto',
                                        minWidth: column.minWidth || '80px'
                                    }}>
                                        {column.title}
                                    </th>
                                ))}
                                {showActions && (
                                    <th style={{
                                        padding: '1rem',
                                        textAlign: 'center',
                                        color: t.text,
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        width: '120px',
                                        minWidth: '120px'
                                    }}>
                                        {actionColumnTitle}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (showActions ? 1 : 0)}
                                        style={{
                                            padding: '3rem',
                                            textAlign: 'center',
                                            color: t.textSec
                                        }}
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        style={{
                                            borderBottom: index < data.length - 1 ? `1px solid ${t.border}` : 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = isDarkMode ? '#2d3748' : '#f8fafc';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} style={{
                                                padding: '1rem',
                                                textAlign: column.align || 'left',
                                                verticalAlign: 'middle'
                                            }}>
                                                {renderCellContent(item, column)}
                                            </td>
                                        ))}
                                        {showActions && (
                                            <td style={{
                                                padding: '1rem',
                                                width: '120px',
                                                minWidth: '120px',
                                                verticalAlign: 'middle'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    {viewPermission && onView && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onView(item)}
                                                            style={{
                                                                background: t.success,
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="View"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                    )}
                                                    {editPermission && onEdit && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onEdit(item)}
                                                            style={{
                                                                background: t.primary,
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Edit"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                    )}
                                                    {deletePermission && onDelete && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item)}
                                                            style={{
                                                                background: t.danger,
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render pagination if provided */}
            {renderPagination()}
        </div>
    );
};

export default CustomTable;