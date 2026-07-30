INSERT INTO roles (name)
VALUES
    ('admin'),
    ('editor'),
    ('viewer')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (name)
VALUES
    ('create'),
    ('read'),
    ('update'),
    ('delete')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin'
  AND p.name IN ('create', 'read', 'update', 'delete')
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'editor'
  AND p.name IN ('create', 'read', 'update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'viewer'
  AND p.name = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO users (
    name,
    email,
    password_hash,
    role_id
)
SELECT
    'Admin User',
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf', 12)),
    r.id
FROM roles r
WHERE r.name = 'admin'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (
    name,
    email,
    password_hash,
    role_id
)
SELECT
    'Editor User',
    'editor@example.com',
    crypt('Editor123!', gen_salt('bf', 12)),
    r.id
FROM roles r
WHERE r.name = 'editor'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (
    name,
    email,
    password_hash,
    role_id
)
SELECT
    'Viewer User',
    'viewer@example.com',
    crypt('Viewer123!', gen_salt('bf', 12)),
    r.id
FROM roles r
WHERE r.name = 'viewer'
ON CONFLICT (email) DO NOTHING;