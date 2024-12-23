'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton({ datax }) {
    console.log(datax);
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const response = await fetch('/api/tool_delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: datax}),
            });

            const result = await response.json();
            if (response.ok) {

                window.location.reload()
                setData(prevData => prevData.filter(item => item.id !== id));
            } else {
                alert(result.mes);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                disabled={loading}
                sx={{ position: 'absolute', top: 40, right: 8, minWidth: 28, minHeight: 28, width: 28, height: 28, backgroundColor: '#EE0000', borderRadius: 1, color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}

                onClick={handleDelete}
            >
                <DeleteIcon />
            </Button>
        </>
    );
}