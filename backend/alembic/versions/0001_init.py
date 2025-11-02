"""Initial migration creating postcards and rip_results tables

Revision ID: 0001
Revises:
Create Date: 2025-11-02 01:49:25.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create postcards table
    op.create_table(
        'postcards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('creator', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('is_public', sa.Boolean(), nullable=False),
        sa.Column('track_ids', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create rip_results table
    op.create_table(
        'rip_results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_url', sa.String(length=500), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('artist', sa.String(length=200), nullable=True),
        sa.Column('duration', sa.Float(), nullable=True),
        sa.Column('file_path', sa.String(length=500), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('format', sa.String(length=20), nullable=True),
        sa.Column('bitrate', sa.String(length=20), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('rip_results')
    op.drop_table('postcards')
