'use client';

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import React from 'react';

export function DeleteBtnSetting(data) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDelete = async (data) => {
        console.log(data);
        try {
            const response = await fetch('/api/prompt_delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('xóa thành công:', result.mes);
                setDialogOpen(false);
            } else {
                console.error('xóa thất bại:', result.mes);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handlePick = () => {
        setDialogOpen(true)
    }

    return (
        <>
            <Button
                sx={{
                    '&:hover': {
                        backgroundColor: '#DD0000',
                    }, backgroundColor: '#EE0000', borderRadius: 1, color: 'white', width: '20%',
                }}
                onClick={handlePick}
            >
                Xóa
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Cảnh báo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn xóa prompt? Bạn sẽ không thể khôi phục lại prompt đã xóa.
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
