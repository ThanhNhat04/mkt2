'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteButton({ datax }) {
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            const response = await fetch('/api/tool_delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: datax }),
            });

            const result = await response.json();
            if (response.ok) {
                window.location.reload()
            } else {
                alert(result.mes);
            }
        } catch (error) { }
        finally { setLoading(false) }
    };

    const handlePick = () => {
        setDialogOpen(true)
    }

    return (
        <>
            <Button
                disabled={loading}
                sx={{
                    position: 'absolute', top: 40, right: 8, minWidth: 28, minHeight: 28, width: 28, height: 28, backgroundColor: '#EE0000', borderRadius: 1, color: 'white',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}

                onClick={handlePick}
            >
                <DeleteIcon />
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Cảnh báo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn xóa 1 Tool? Bạn sẽ không thể khôi phục lại Tool đã xóa.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Không
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Có
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}